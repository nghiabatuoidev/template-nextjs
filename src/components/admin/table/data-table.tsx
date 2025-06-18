"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  MoreHorizontal,
  Trash2,
  Edit,
  Plus,
  Globe,
} from "lucide-react";

interface ICountry {
  id?: number;
  slug?: string;
  name?: string;
  createAt?: string;
}

const mockData: ICountry[] = [
  {
    id: 1,
    slug: "viet-nam",
    name: "Việt Nam",
    createAt: "2024-01-15",
  },
  {
    id: 2,
    slug: "united-states",
    name: "United States",
    createAt: "2024-01-20",
  },
  {
    id: 3,
    slug: "japan",
    name: "Japan",
    createAt: "2024-02-01",
  },
  {
    id: 4,
    slug: "south-korea",
    name: "South Korea",
    createAt: "2024-02-10",
  },
  {
    id: 5,
    slug: "singapore",
    name: "Singapore",
    createAt: "2024-02-15",
  },
  {
    id: 6,
    slug: "thailand",
    name: "Thailand",
    createAt: "2024-02-20",
  },
];

export function DataTableDemo() {
  const [data, setData] = useState<ICountry[]>(mockData);
  const [selectedCountries, setSelectedCountries] = useState<number[]>([]);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    countryIds: [] as number[],
    type: "single" as "single" | "bulk",
  });

  const [countryDialog, setCountryDialog] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    country: { id: 0, name: "", createAt: "" },
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Generate slug from country name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCountries(data.map((country) => country.id!));
    } else {
      setSelectedCountries([]);
    }
  };

  const handleSelectCountry = (countryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCountries([...selectedCountries, countryId]);
    } else {
      setSelectedCountries(selectedCountries.filter((id) => id !== countryId));
    }
  };

  const openDeleteDialog = (countryIds: number[], type: "single" | "bulk") => {
    setDeleteDialog({
      open: true,
      countryIds,
      type,
    });
  };

  const openCountryDialog = (mode: "create" | "edit", country?: ICountry) => {
    setCountryDialog({
      open: true,
      mode,
      country: {
        id: country?.id ?? 0,
        name: country?.name ?? "",
        createAt: country?.createAt ?? "",
      },
    });
  };

  const confirmDelete = () => {
    setData(data.filter((country) => !deleteDialog.countryIds.includes(country.id!)));
    console.log("Đã xóa các quốc gia:", deleteDialog.countryIds);
    setDeleteDialog({ open: false, countryIds: [], type: "single" });
    if (deleteDialog.type === "bulk") {
      setSelectedCountries([]);
    }
  };

  const confirmCountryAction = () => {
    const { mode, country } = countryDialog;

    if (!country.name?.trim()) {
      alert("Vui lòng nhập tên quốc gia!");
      return;
    }

    if (mode === "create") {
      const newCountry: ICountry = {
        id: Math.max(...data.map((c) => c.id!), 0) + 1,
        name: country.name.trim(),
        slug: generateSlug(country.name.trim()),
        createAt: getCurrentDate(),
      };
      setData([...data, newCountry]);
      console.log("Tạo quốc gia mới:", newCountry);
    } else {
      setData(
        data.map((c) =>
          c.id === country.id 
            ? { 
                ...c, 
                name: country.name!.trim(),
                slug: generateSlug(country.name!.trim())
              } 
            : c
        )
      );
      console.log("Cập nhật quốc gia:", { ...country });
    }

    setCountryDialog({
      open: false,
      mode: "create",
      country: { id: 0, name: "", createAt: "" },
    });
  };

  const isAllSelected = selectedCountries.length === data.length && data.length > 0;
  const isIndeterminate =
    selectedCountries.length > 0 && selectedCountries.length < data.length;

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Quốc gia</h2>
        <Button
          onClick={() => openCountryDialog("create")}
          className="cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Quốc gia
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedCountries.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-md border">
          <span className="text-sm text-blue-700 font-medium">
            Đã chọn {selectedCountries.length} quốc gia
          </span>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openDeleteDialog(selectedCountries, "bulk")}
              className="text-red-600 hover:text-red-700 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="border rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  ref={(el) => {
                    const input = el as HTMLInputElement | null;
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                />
              </TableHead>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Tên Quốc gia</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Hiển thị</TableHead>
              <TableHead className="w-[100px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((country) => (
              <TableRow key={country.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCountries.includes(country.id!)}
                    onCheckedChange={(checked) =>
                      handleSelectCountry(country.id!, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">{country.id}</TableCell>
                <TableCell className="font-medium">{country.name}</TableCell>
                <TableCell>
                  <code className="border px-2 py-1 rounded text-sm">
                    {country.slug}
                  </code>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {country.createAt ? formatDate(country.createAt) : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="gap-1">
                    <Globe className="w-3 h-3" />
                    {country.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => openCountryDialog("edit", country)}
                        className="cursor-pointer"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog([country.id!], "single")}
                        className="text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa quốc gia
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa quốc gia</DialogTitle>
            <DialogDescription>
              {deleteDialog.type === "bulk"
                ? `Bạn có chắc chắn muốn xóa ${deleteDialog.countryIds.length} quốc gia đã chọn?`
                : "Bạn có chắc chắn muốn xóa quốc gia này?"}
              <br />
              <span className="text-red-600 font-medium">
                Hành động này không thể hoàn tác!
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Country Dialog */}
      <Dialog
        open={countryDialog.open}
        onOpenChange={(open) => setCountryDialog({ ...countryDialog, open })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {countryDialog.mode === "create" ? "Thêm Quốc gia Mới" : "Chỉnh Sửa Quốc gia"}
            </DialogTitle>
            <DialogDescription>
              {countryDialog.mode === "create"
                ? "Tạo một quốc gia mới cho hệ thống"
                : "Cập nhật thông tin quốc gia"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="countryName">Tên Quốc gia</Label>
              <Input
                id="countryName"
                value={countryDialog.country.name || ""}
                onChange={(e) =>
                  setCountryDialog({
                    ...countryDialog,
                    country: { ...countryDialog.country, name: e.target.value },
                  })
                }
                placeholder="Nhập tên quốc gia..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setCountryDialog({
                  open: false,
                  mode: "create",
                  country: { id: 0, name: "", createAt: "" },
                })
              }
            >
              Hủy
            </Button>
            <Button
              onClick={confirmCountryAction}
              disabled={!countryDialog.country.name?.trim()}
            >
              {countryDialog.mode === "create" ? "Tạo Quốc gia" : "Cập Nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}