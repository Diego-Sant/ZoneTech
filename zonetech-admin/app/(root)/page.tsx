import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

const RootPage = () => {
  return (
    <div>
      <UserButton afterSignOutUrl="/" /> {/* Feito isso pois automaticamente ao deslogar é enviado para a página do Clerk */}
    </div>
  )
}

export default RootPage
  