"use client";
import { useEffect, useState } from "react";
import ThumbnailCarousel from "@/components/Product/ThumbnailCarousel";
import Link from "next/link";
import {
  FaArrowRight,
  FaCartPlus,
  FaChevronRight,
  FaSearchLocation,
} from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { FiStar } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IoIosSearch } from "react-icons/io";
import ProductInfoCard from "@/components/Product/ProductInfoCard";
import Pagination from "@/components/Product/Pagination";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Comment {
  id: number;
  title: string;
  comment: string;
  star: number;
  rating: number;
  productId: number;
  userId: string;
}
interface UserInfo {
  id: number;
  fullName: string;
  userId: string;
}
interface Product {
  id: number;
  product_Name: string;
  origin: string;
  unique: string;
  apply: string;
  result: string;
  userId: string;
  price: number;
  rating: number;
  productTypeId: number;
  censor: boolean;
  quantity: number;
  productImages: ProductImage[];
  comments: string[];
}
interface ProductImage {
  id: number;
  images: string;
  productId: number;
}
interface GetProductProps {
  Token: string | undefined;
}
interface UserInfo {
  username: string;
  email: string;
  roles: string[];
}
interface ProductType {
  id: number;
  productType_Name: string;
}
const GetProductId = ({ Token }: GetProductProps) => {
  const [productId, setProductId] = useState<number | null>(null);
  const [productData, setProductData] = useState<Product | null>(null);
  const [productTypeId, setProductTypeId] = useState<number | null>(null);
  const [productTypeName, setProductTypeName] = useState<string | null>(null);
  const [loadingProductType, setLoadingProductType] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsall, setCommentsAll] = useState<Comment[]>([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/account", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user!");
        }
        const data: UserInfo = await res.json();
        setRoles(data.roles);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [Token]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const id = params.get("Id");

      if (id) {
        setProductId(Number(id));
      }

      const pathSegments = url.pathname.split("/");
      const productNameSegment = pathSegments[pathSegments.length - 1];
      const decodedProductName = decodeURIComponent(productNameSegment).replace(
        /-/g,
        " "
      );

      const fetchProductData = async () => {
        try {
          const response = await fetch(
            `http://localhost:5126/api/product/${productId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch product data");
          }
          const data = await response.json();
          setProductData(data);

          const productTypeId = data.productTypeId;
          if (productTypeId) {
            setProductTypeId(productTypeId);

            const typeResponse = await fetch(
              `http://localhost:5126/api/product-type/${productTypeId}`
            );
            if (!typeResponse.ok) {
              throw new Error("Failed to fetch product type data");
            }
            const typeData = await typeResponse.json();
            setProductTypeName(typeData.productType_Name);
          } else {
            console.error("Product Type ID not found.");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoadingProductType(false);
        }
      };
      const fetchCommentsAll = async () => {
        if (productId !== null) {
          try {
            const response = await fetch(
              `http://localhost:5126/api/account/comment/${productId}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch comments");
            }
            const comments = await response.json();
            setCommentsAll(comments);
            const total = comments.length;
            const starsSum = comments.reduce(
              (sum: number, comment: Comment) => sum + comment.star,
              0
            );
            const average = total > 0 ? (starsSum / total).toFixed(1) : "0";

            setTotalRatings(total);
            setAverageRating(Number(average));
          } catch (error) {
            console.error("Error fetching comments:", error);
          }
        }
      };
      const fetchComments = async () => {
        if (productId !== null) {
          try {
            const response = await fetch(
              `http://localhost:5126/api/account/comment/${productId}?PageNumber=${pageNumber}&PageSize=5`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch comments");
            }
            const commentsData = await response.json();
            setComments(commentsData);
          } catch (error) {
            console.error("Error fetching comments:", error);
          }
        }
      };
      const fetchUserInfor = async () => {
        try {
          const userInfoResponse = await fetch(
            `http://localhost:5126/api/users-information`
          );
          if (!userInfoResponse.ok) {
            throw new Error("Failed to fetch user information");
          }
          const userInforData = await userInfoResponse.json();
          setUserInfo(userInforData);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      const fetchSimilarProducts = async () => {
        try {
          const res = await fetch(
            `https://localhost:7146/api/product/suggest-similar-ml/${productId}`
          );
          if (!res.ok) {
            throw new Error("Failed to fetch product suggest");
          }
          const data = await res.json();
          setSimilarProducts(data);
        } catch (error) {}
      };
      const fetchProductType = async () => {
        try {
          const res = await fetch(`https://localhost:7146/api/product-type`);
          if (!res.ok) {
            throw new Error("Failed to fetch product type");
          }
          const productType = await res.json();
          setProductTypes(productType);
        } catch (error) {
          console.error("Error fetching product type:", error);
        }
      };
      if (productId !== null) {
        fetchProductData();
        fetchComments();
        fetchUserInfor();
        fetchCommentsAll();
        fetchProductType();
        fetchSimilarProducts();
      }
    }
  }, [productId, pageNumber]);
  const findUserForProduct = (userId: string) => {
    return userInfo.find((user) => user.userId === userId);
  };
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const res = await fetch(
          `https://localhost:7146/api/product/suggest-similar-ml/${productId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch product suggest");
        }
        const data = await res.json();
        setSimilarProducts(data);
      } catch (error) {}
    };
    fetchSimilarProducts();
  }, []);
  const getFullName = (userId: string): string => {
    const user = userInfo.find((user) => user.userId == userId);
    return user ? user.fullName : "Unknown user";
  };
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (productData && quantity < productData.quantity) {
      setQuantity(quantity + 1);
    }
  };
  const starCounts = commentsall.reduce(
    (counts, comment) => {
      const star = comment.star as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
      return counts;
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  );
  const ratingCounts: { [key: string]: number } = {
    "5": starCounts[5],
    "4": starCounts[4],
    "3": starCounts[3],
    "2": starCounts[2],
    "1": starCounts[1],
  };

  const getPercentage = (count: number) => {
    return (count / totalRatings) * 100;
  };
  const totalItems = totalRatings;
  const itemsPerPage = 5;
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };
  const handleAddToCart = async (product: Product) => {
    if (!Token) {
      router.push("/login");
      return;
    }
    if (roles.includes("Creator")) {
      alert("Nhà cung cấp không có quyền đặt hàng");
      return;
    }
    const orderDetailData = {
      orderId: 0,
      productId: product.id,
      quantity: 1,
      unitPrice: 0,
    };
    try {
      const createOrderResponse = await fetch(
        "https://localhost:7146/api/admin/orders-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(orderDetailData),
        }
      );
      if (!createOrderResponse.ok) {
        throw new Error(`Failed : ${createOrderResponse.statusText}`);
      }
      alert("Add product success");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      alert(error.message);
    }
  };
  const getProductTypeName = (productTypeId: number) => {
    const productType = productTypes.find((type) => type.id === productTypeId);
    return productType ? productType.productType_Name : "Unknown";
  };
  return (
    <div>
      {productData?.censor === true ? (
        <div>
          <nav className="w-full h-[3rem] border-2">
            <div className="flex flex-row space-x-3 ml-36">
              <Link href={"/"} className="text-2xl mt-3">
                <IoHomeOutline />
              </Link>
              <FaChevronRight className="mt-5" />
              <Link href={"/product"} className="mt-3 text-lg">
                Sản phẩm
              </Link>
              <FaChevronRight className="mt-5" />
              <p className="mt-3 text-lg cursor-pointer hover:text-teal-400">
                {productData ? productData.product_Name : "Loading..."}
              </p>
            </div>
          </nav>
          {productData && (
            <div>
              <div className="flex my-20 mx-36 justify-between">
                <div>
                  <h1 className="font-bold text-4xl">
                    {productData.product_Name}
                  </h1>
                  <h2 className="mt-10 font-bold text-lg">
                    Số lượng:
                    <a className="text-teal-500"> {productData.quantity}</a>
                  </h2>
                  <div className=" flex">
                    <div className="flex flex-row rounded-full bg-yellow-200 text-sm mt-10 items-center">
                      <FiStar className="text-yellow-500 text-[0.7rem] ml-1" />
                      <div className="mx-1">
                        {productData.rating}({totalRatings} đánh giá)
                      </div>
                    </div>
                    <div className="ml-5 rounded-full bg-gray-200 mt-10 items-center">
                      <p className="mx-1">{productTypeName}</p>
                    </div>
                  </div>
                  <div className="text-teal-500 mt-5 text-2xl">---------</div>
                </div>
                <div className="space-y-10">
                  <p className="font-bold text-4xl text-teal-900">
                    {productData.price?.toLocaleString("en-US")} đ
                  </p>
                  <div className="flex items-center space-x-5">
                    <label htmlFor="quantity" className="font-bold text-lg">
                      Số lượng:
                    </label>
                    <div className="flex items-center space-x-2 ">
                      <Button
                        onClick={handleDecrease}
                        className="px-3 py-1 text-lg font-bold bg-teal-500 text-white w-8 h-8 rounded-full hover:bg-teal-700"
                      >
                        -
                      </Button>
                      <div className="px-4 py-2 border rounded-md">
                        {quantity}
                      </div>
                      <Button
                        onClick={handleIncrease}
                        className="px-3 py-1 text-lg font-bold bg-teal-500 text-white w-8 h-8 rounded-full hover:bg-teal-700"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <p className="text-right">
                    <Link href={"/cart"}>
                      <Button className="rounded-full bg-teal-500 hover:bg-teal-700 text-lg">
                        <FaCartPlus className="mr-1" /> Đặt hàng
                      </Button>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mx-10">
            {productId !== null ? (
              <ThumbnailCarousel productId={productId} />
            ) : (
              <p>Loading product images...</p>
            )}
          </div>

          <div className="flex border z-50 h-[40px] space-x-10   items-center mt-20 mx-36 rounded-lg text-sm bg-gray-50">
            <div className="ml-5">
              <Button
                className="bg-gray-100 w-20 h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
                onClick={() => {
                  const originElement = document.getElementById("origin");
                  if (originElement) {
                    originElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              >
                <Label id="origin">Xuất xứ</Label>
              </Button>
            </div>
            <div className="mr-10">
              <Button
                className="bg-gray-100 w-[10rem] h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
                onClick={() => {
                  const uniqueElement = document.getElementById("unique");
                  if (uniqueElement) {
                    uniqueElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              >
                <Label>Tính mới, Tính độc đáo</Label>
              </Button>
            </div>
            <div>
              <Button
                className="bg-gray-100 w-36 h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
                onClick={() => {
                  const applyElement = document.getElementById("apply");
                  if (applyElement) {
                    applyElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              >
                <Label>Khả năng ứng dụng</Label>
              </Button>
            </div>
            <div>
              <Button
                className="bg-gray-100 w-20 h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
                onClick={() => {
                  const resultElement = document.getElementById("result");
                  if (resultElement) {
                    resultElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              >
                <Label>Kết quả</Label>
              </Button>
            </div>
            <div>
              <Button
                className="bg-gray-100 w-[8.1rem] h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
                onClick={() => {
                  const commentsElement = document.getElementById("similar");
                  if (commentsElement) {
                    commentsElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              >
                {productData && (
                  <Label className="flex">Sản phẩm tương tự</Label>
                )}
              </Button>
            </div>
            <div>
              <Button
                className="bg-gray-100 w-24 h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
                onClick={() => {
                  const commentsElement = document.getElementById("comment");
                  if (commentsElement) {
                    commentsElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              >
                {productData && (
                  <Label className="flex">
                    Đánh giá{" "}
                    <div className="ml-1 rounded-full bg-slate-300 w-4">
                      {totalRatings}
                    </div>
                  </Label>
                )}
              </Button>
            </div>
          </div>
          {productData && (
            <div className="mx-32 mt-20 space-y-20 mb-20">
              <div className="flex space-y-5 justify-between" id="origin">
                <div className="max-w-3xl">
                  <h1 className="text-4xl font-bold ">Xuất xứ</h1>
                  <div className="text-teal-500 text-2xl">---------</div>
                  <h3 className="text-2xl font-bold">Xuất xứ sản phẩm</h3>
                  <p className="text-lg">{productData.origin}</p>
                </div>
                {productId !== null && (
                  <ProductInfoCard productID={productId} />
                )}
              </div>
              <div className="max-w-3xl" id="unique">
                <div className="space-y-5">
                  <h1 className="text-4xl font-bold">Tính mới, Tính độc đáo</h1>
                  <div className="text-teal-500 text-2xl">---------</div>
                  <h3 className="text-2xl font-bold">
                    Tính mới, độc đáo của sản phẩm
                  </h3>
                  <p className="text-lg">{productData.unique}</p>
                </div>
              </div>
              <div className="space-y-5 max-w-3xl" id="apply">
                <h1 className="text-4xl font-bold">
                  Khả năng ứng dụng, triển khai
                </h1>
                <div className="text-teal-500 text-2xl">---------</div>
                <h3 className="text-2xl font-bold">
                  Khả năng ứng dụng, triển khai của sản phẩm
                </h3>
                <p className="text-lg">{productData.apply}</p>
              </div>
              <div className="space-y-5 max-w-3xl" id="result">
                <h1 className="text-4xl font-bold">Kết quả</h1>
                <div className="text-teal-500 text-2xl">---------</div>
                <h3 className="text-2xl font-bold">
                  Kết quả quan trọng đã triển khai ứng dụng
                </h3>
                <p>{productData.result}</p>
              </div>
              <div className="space-y-5 max-w-3xl" id="comment">
                <div className="flex flex-row justify-between">
                  <h1 className="flex text-4xl font-bold">
                    Đánh giá (<div>{totalRatings}</div>)
                  </h1>
                  <div className="flex space-x-5">
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="Tìm đánh giá"
                        className="w-64 pl-10 pr-4 py-2 border-2 border-teal-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                      <IoIosSearch className="absolute left-3 text-lg text-gray-400" />
                    </div>
                    <Button className="rounded-full bg-teal-500 text-slate-200 hover:bg-teal-700 items-center">
                      <FiStar className="mr-1" />
                      Đánh giá
                    </Button>
                  </div>
                </div>
                <div className="text-teal-500 text-2xl">---------</div>
              </div>
              <div className="space-y-10">
                <div className="w-full max-w-3xl border rounded-3xl p-6 bg-white shadow">
                  <div className="flex items-center">
                    <span className="text-4xl font-bold text-orange-500">
                      {productData.rating}
                    </span>
                    <span className="ml-4 text-gray-500">/ 5</span>
                  </div>
                  <div className="flex mt-6">
                    <div className="w-1/2 flex flex-col justify-between">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center mb-2">
                          <span className="text-sm text-gray-700">
                            {star} sao
                          </span>
                          <div className="flex-1 h-2 ml-2 bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{
                                width: `${getPercentage(
                                  ratingCounts[star.toString()]
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {ratingCounts[star.toString()]} đánh giá
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {comments.slice(0, 5).map((comment) => (
                  <div
                    key={comment.id}
                    className="w-full max-w-3xl border rounded-3xl p-6 bg-white shadow"
                  >
                    <div className="flex items-center">
                      <span className="flex space-x-1 text-2xl font-bold text-orange-500">
                        {[...Array(comment.star)].map((_, index) => (
                          <FiStar key={index} />
                        ))}
                      </span>
                    </div>
                    <div className="flex flex-col mt-6 max-w-3xl space-y-3">
                      <div className="text-xl font-bold">{comment.title}</div>
                      <div className=" space-y-1">
                        <p className="font-bold">
                          {getFullName(comment.userId)}
                        </p>
                        <p>{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="container max-w-3xl">
                  <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-20 mb-3 space-y-1">
          <img src={"/images/server/sad.png"} alt="" />
          <div className="font-bold text-3xl">
            Rất tiếc, InnoTrade không tìm thấy kết quả cho bạn
          </div>
          <p>Nhấn OK để bắt đầu tìm kiếm mới.</p>
          <Link href={"/"}>
            <Button className="rounded-full h-[50px] border-2 bg-white text-black hover:bg-gray-100">
              <span className="text-xl">Ok</span>{" "}
              <FaArrowRight className="ml-2 text-xl" />
            </Button>
          </Link>
        </div>
      )}
      <div className="mx-36 space-y-3 mb-8" id="similar">
        <p className="font-bold text-4xl">Sản phẩm tương tự</p>
        <p className="font-bold text-2xl text-teal-500 pb-8">----------</p>
        <Carousel
          opts={{
            align: "start",
          }}
        >
          <CarouselContent>
            {similarProducts
              .filter((product) => product.censor === true)
              .map((product) => {
                const matchingUser = findUserForProduct(product.userId);
                const userName = matchingUser
                  ? matchingUser.fullName
                  : "Unknown User";
                return (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                    <div className="bg-white border shadow-inner shadow-gray-200 rounded-2xl overflow-hidden">
                      <div className="p-8">
                        <img
                          src={
                            product.productImages &&
                            product.productImages.length > 0
                              ? `https://localhost:7146/Resources/${product.productImages[0]?.images}`
                              : `/images/server/default.jpg`
                          }
                          alt={product.product_Name}
                          className="w-[350px] h-[200px] rounded-2xl"
                        />
                      </div>

                      <div className="p-4">
                        <Link
                          key={product.id}
                          href={`/product/search-product/${product.product_Name.replaceAll(
                            " ",
                            "-"
                          )}?Id=${product.id}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center text-yellow-500">
                              <FiStar />
                              <span className="ml-1 font-bold">
                                {product.rating}
                              </span>
                              <span className="text-gray-500 text-sm ml-2">
                                ({product.comments.length} đánh giá)
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold mb-2">
                            {product.product_Name}
                          </h3>
                          <p className="text-gray-500 flex">
                            <FaSearchLocation className="mt-1 mr-1" />
                            {userName}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Loại sản phẩm:{" "}
                            {getProductTypeName(product.productTypeId)}
                          </p>
                        </Link>
                        <div className="flex mt-2 justify-between mx-4">
                          <p className="text-teal-500 font-bold text-lg mt-2">
                            {product.price.toLocaleString("en-US")}đ
                          </p>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="bg-teal-500 text-white py-2 px-4 rounded-full ml-14 hover:bg-teal-600"
                          >
                            Đặt ngay
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default GetProductId;
