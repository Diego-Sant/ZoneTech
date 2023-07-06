import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();

// Configuração padrão do clerk para enviar usuário não logado para o menu de login
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};