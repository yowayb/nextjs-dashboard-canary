import { Metadata } from "next";
import ClientsTable from "./table";

export const metadata: Metadata = {
    title: 'Clients',
};
  
export default function Page() {
    // TODO new client modal form
    return <ClientsTable />
}