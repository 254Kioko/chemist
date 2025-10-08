import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Medicine {
  id: string;
  name: string;
  stock_quantity: number;
  reorder_level: number;
  price: number;
}

interface MedicineListProps {
  medicines: Medicine[];
}

const MedicineList = ({ medicines }: MedicineListProps) => {
  const [search, setSearch] = useState("");

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStockBadge = (stock: number, reorder: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= reorder) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Low Stock</Badge>;
    } else {
      return <Badge variant="outline" className="border-green-500 text-green-600">In Stock</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medicine Inventory</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No medicines found
                </TableCell>
              </TableRow>
            ) : (
              filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.stock_quantity} units</TableCell>
                  <TableCell>KSh {medicine.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {getStockBadge(medicine.stock_quantity, medicine.reorder_level)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MedicineList;
