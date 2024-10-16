"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  VisibilityState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export type OrderData = {
  id: number;
  userId: string;
  orderStatus: string;
  orderDate: string;
  shippedDate: string;
  totalAmount: number;
  orderDetails: {
    id: number;
    ordersId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
};
interface Product {
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
}
interface TableOrdersProps {
  Token: string | undefined;
}

const TableOrders = ({ Token }: TableOrdersProps) => {
  const [ordersData, setOrdersData] = React.useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const [products, setProducts] = React.useState<Product[]>([]);

  const fetchProducts = React.useCallback(async () => {
    try {
      const productsRes = await fetch("https://localhost:7146/api/product", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      const productsData = await productsRes.json();
      setProducts(productsData); // Lưu thông tin sản phẩm vào state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [Token]);

  const fetchOrders = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://localhost:7146/api/creator/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch orders.");
      const data: OrderData[] = await response.json();
      setOrdersData(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [Token, toast]);

  React.useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);
  const handleUpdateOrderStatus = async (orderId: number) => {
    try {
      const res = await fetch(
        `https://localhost:7146/api/creator/orders/confirm/${orderId}`,
        {
          method: "PUT",
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
        description: "Updates successfully",
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    }
  };
  const getProductNameById = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.product_Name : "Unknown Product";
  };
  const columns: ColumnDef<OrderData>[] = [
    {
      accessorKey: "orderDate",
      header: "Ngày đặt hàng",
      cell: ({ row }) => new Date(row.getValue("orderDate")).toLocaleString(),
    },
    {
      accessorKey: "shippedDate",
      header: "Ngày giao hàng",
      cell: ({ row }) => new Date(row.getValue("shippedDate")).toLocaleString(),
    },
    {
      accessorKey: "totalAmount",
      header: "Tổng số tiền",
      cell: ({ row }) =>
        `${(row.getValue("totalAmount") as number).toLocaleString()} VND`,
    },
    {
      header: "Chi tiết đơn hàng",
      cell: ({ row }) => (
        <div>
          {row.original.orderDetails.map((detail) => (
            <div key={detail.id} className="mb-2">
              <p>
                <strong>Tên sản phẩm:</strong>{" "}
                {getProductNameById(detail.productId)}
              </p>
              <p>
                <strong>Số lượng:</strong> {detail.quantity}
              </p>
              <p>
                <strong>Đơn giá:</strong> {detail.unitPrice.toLocaleString()}{" "}
                VND
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "orderStatus",
      header: "Trạng thái đơn hàng",
    },
    {
      id: "action",
      cell: ({ row }) => {
        const orderStatus = row.getValue("orderStatus");

        return (
          <div>
            {orderStatus === "Pending" && (
              <Button onClick={() => handleUpdateOrderStatus(row.original.id)}>
                Confirmed
              </Button>
            )}
            {orderStatus === "Confirmed" && (
              <Button onClick={() => handleUpdateOrderStatus(row.original.id)}>
                Shipped
              </Button>
            )}
            {orderStatus === "Delivered" && <span>Delivered</span>}
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
    data: ordersData,
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
          placeholder="Filter order status..."
          value={
            (table.getColumn("orderStatus")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("orderStatus")?.setFilterValue(event.target.value)
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
};

export default TableOrders;
