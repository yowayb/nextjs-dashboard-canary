import { Metadata } from "next";
import ClientsTable from "./table";

export const metadata: Metadata = {
    title: 'Clients',
};
  
export default function Page() {
    return <ClientsTable />
}