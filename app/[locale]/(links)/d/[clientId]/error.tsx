"use client";

import { Empty } from "@/components/ui/empty";

const Error = ({error}: {error: Error}) => {
  return ( 
    <Empty label={`Erro: ${error.message}`} />
   );
}
 
export default Error;
