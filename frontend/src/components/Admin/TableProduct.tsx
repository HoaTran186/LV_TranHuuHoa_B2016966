"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { IoConstruct } from "react-icons/io5";
import Link from "next/link";
import { FaCheck, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProductForm from "@/components/Admin/ProductForm";

export type CombinedProduct = {
  id: number;
  product_Name: string;
  origin: string;
  unique: string;
  apply: string;
  result: string;
  quantity: number;
  rating: number;
  price: number;
  productTypeId: number;
  censor: boolean;
  userId: string;
  productImages: [];
  comments: [];
};

interface ProductType {
  id: number;
  productType_Name: string;
}

interface UserInfo {
  id: string;
  fullName: string;
  userId: string;
}

interface TableProductProps {
  Token: string | undefined;
}

const TableProduct = ({ Token }: TableProductProps) => {
  const [productData, setProductData] = React.useState<CombinedProduct[]>([]);
  const [productTypes, setProductTypes] = React.useState<ProductType[]>([]);
  const [userInfo, setUserInfo] = React.useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] =
    React.useState<CombinedProduct | null>(null);
  const { toast } = useToast();

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const productRes = await fetch("https://localhost:7146/api/product");
      if (!productRes.ok) {
        throw new Error("Failed to fetch products.");
      }
      const productsData = await productRes.json();

      const productTypeRes = await fetch(
        "https://localhost:7146/api/product-type"
      );
      if (!productTypeRes.ok) {
        throw new Error("Failed to fetch product types.");
      }
      const typesData = await productTypeRes.json();

      const userInfoRes = await fetch(
        "https://localhost:7146/api/users-information"
      );
      if (!userInfoRes.ok) {
        throw new Error("Failed to fetch user information.");
      }
      const userData = await userInfoRes.json();

      setProductData(productsData);
      setProductTypes(typesData);
      setUserInfo(userData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [Token, toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleDeleteProduct = async (productId: number) => {
    try {
      const res = await fetch(
        `https://localhost:7146/api/admin/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      }
      toast({
        title: "Success",
        description: "Delete successfully",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleUpdateCensor = async (productId: number) => {
    const data = {
      censor: true,
    };
    try {
      const res = await fetch(
        `https://localhost:7146/api/admin/product/cusor/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      }
      toast({
        title: "Success",
        description: "Updates successfully",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    }
  };
  const columns: ColumnDef<CombinedProduct>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "product_Name",
      header: "Tên sản phẩm",
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Sô lượng",
    },
    {
      accessorKey: "productTypeId",
      header: "Lĩnh vực",
      cell: ({ row }) => {
        const productType = productTypes.find(
          (type) => type.id === row.original.productTypeId
        );
        return productType ? productType.productType_Name : "N/A";
      },
    },
    {
      accessorKey: "userId",
      header: "Người đăng",
      cell: ({ row }) => {
        const user = userInfo.find(
          (user) => user.userId === row.original.userId
        );
        return user ? user.fullName : "N/A";
      },
    },
    {
      accessorKey: "censor",
      header: "Duyệt sản phẩm",
      cell: ({ row }) => {
        const censor = row.original.censor === true ? "Đã duyệt" : "Chờ duyệt";
        return censor;
      },
    },
    {
      id: "action",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              className={`bg-green-400 hover:bg-green-600 ${
                product.censor ? "hidden" : ""
              }`}
              onClick={() => handleUpdateCensor(product.id)}
            >
              <FaCheck />
            </Button>
            <Button
              className="bg-blue-400 hover:bg-blue-600"
              onClick={() => {
                setSelectedProduct(product);
                setOpen(true);
              }}
            >
              <FaRegEdit />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-red-400 hover:bg-red-600">
                  <FaRegTrashAlt />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This product will be
                    permanently deleted from the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: productData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter product name..."
          value={
            (table.getColumn("product_Name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("product_Name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {open && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="relative p-6">
              <ProductForm
                type="update"
                data={selectedProduct}
                onUpdate={() => {
                  fetchData();
                  setOpen(false);
                  setSelectedProduct(null);
                }}
                Token={Token}
              />
              <Button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setOpen(false);
                  setSelectedProduct(null);
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableProduct;
