import { fetchSites } from "@/app/lib/data";
import { Metadata } from "next";
import AddSite from "./add";
import DeleteSite from "./delete";

export function generateMetadata({ params }: { params: { client_id: string }}): Metadata {
    return {
        title: params.client_id + ' | Sites',
    }
};

export default async function Page({ params }: { params: { client_id: string } }) {
    const sites = await fetchSites(params.client_id);
    return (
      <div className="w-full">
        <div className="flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                <div>
                  {sites?.map((site) => (
                    <div
                      key={site.url}
                      className="mb-2 w-full rounded-md bg-white p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <div className="flex items-center gap-3">
                              <p>{site.url}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <DeleteSite client_id={params.client_id} url={site.url} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <AddSite client_id={params.client_id}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    );
}