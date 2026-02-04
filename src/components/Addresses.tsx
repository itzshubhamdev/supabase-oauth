"use client";

import type { User } from "@supabase/supabase-js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { Field, FieldLabel } from "./ui/field";
import { useState } from "react";
import { addAddress, deleteAddress } from "@/serverFunctions/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Address = {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export default function Addresses({ user }: { user: User }) {
  const addresses = (user.user_metadata?.billing_addresses || []) as Address[];

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = async () => {
    const res = await addAddress(address, city, state, zip, country);

    if (res.error) {
      return toast.error(res.error.message);
    }

    setAddress("");
    setCity("");
    setState("");
    setZip("");
    setCountry("");
    toast.success("Address added successfully!");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Addresses</CardTitle>
        <CardDescription>Manage your billing addresses.</CardDescription>
        <CardAction>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Add New Address</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Address</SheetTitle>
                <SheetDescription>Add New Billing Address</SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>City</FieldLabel>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>State</FieldLabel>
                  <Input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Zip Code</FieldLabel>
                  <Input value={zip} onChange={(e) => setZip(e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Country</FieldLabel>
                  <Input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </Field>
              </div>
              <SheetFooter>
                <Button type="submit" onClick={handleSubmit}>
                  Save changes
                </Button>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address, i) => (
            <Card key={i}>
              <CardContent className="text-sm">
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>{address.country}</p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <CardAction>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteAddress(i);
                    }}
                  >
                    <Trash2 /> Delete
                  </Button>
                </CardAction>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
