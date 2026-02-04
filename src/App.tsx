import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DocsIntroduction from "./pages/docs/Introduction";
import DocsInstallation from "./pages/docs/Installation";
import DocsQuickstart from "./pages/docs/Quickstart";
import DocsCoreIdentity from "./pages/docs/core/Identity";
import DocsCoreTraits from "./pages/docs/core/Traits";
import DocsCoreErrors from "./pages/docs/core/Errors";
import DocsFlowsOAuth2 from "./pages/docs/flows/OAuth2";
import DocsFlowsDevice from "./pages/docs/flows/DeviceFlow";
import DocsFlowsClientCredentials from "./pages/docs/flows/ClientCredentials";
import DocsFlowsCredentials from "./pages/docs/flows/Credentials";
import DocsSessionsStores from "./pages/docs/sessions/Stores";
import DocsSessionsConfig from "./pages/docs/sessions/Config";
import DocsFrameworksActix from "./pages/docs/frameworks/Actix";
import DocsFrameworksAxum from "./pages/docs/frameworks/Axum";
import DocsProvidersGithub from "./pages/docs/providers/Github";
import DocsProvidersGoogle from "./pages/docs/providers/Google";
import DocsProvidersDiscord from "./pages/docs/providers/Discord";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Documentation Routes */}
          <Route path="/docs" element={<DocsIntroduction />} />
          <Route path="/docs/installation" element={<DocsInstallation />} />
          <Route path="/docs/quickstart" element={<DocsQuickstart />} />
          
          {/* Core Concepts */}
          <Route path="/docs/core/identity" element={<DocsCoreIdentity />} />
          <Route path="/docs/core/traits" element={<DocsCoreTraits />} />
          <Route path="/docs/core/errors" element={<DocsCoreErrors />} />
          
          {/* Authentication Flows */}
          <Route path="/docs/flows/oauth2" element={<DocsFlowsOAuth2 />} />
          <Route path="/docs/flows/device" element={<DocsFlowsDevice />} />
          <Route path="/docs/flows/client-credentials" element={<DocsFlowsClientCredentials />} />
          <Route path="/docs/flows/credentials" element={<DocsFlowsCredentials />} />
          
          {/* Sessions */}
          <Route path="/docs/sessions/stores" element={<DocsSessionsStores />} />
          <Route path="/docs/sessions/config" element={<DocsSessionsConfig />} />
          
          {/* Frameworks */}
          <Route path="/docs/frameworks/actix" element={<DocsFrameworksActix />} />
          <Route path="/docs/frameworks/axum" element={<DocsFrameworksAxum />} />
          
          {/* Providers */}
          <Route path="/docs/providers/github" element={<DocsProvidersGithub />} />
          <Route path="/docs/providers/google" element={<DocsProvidersGoogle />} />
          <Route path="/docs/providers/discord" element={<DocsProvidersDiscord />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
