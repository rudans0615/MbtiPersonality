import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import Test from "@/pages/test";
import Results from "@/pages/results";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import TypeDetail from "@/pages/type-detail";
import TetoEgenTest from "@/pages/teto-egen-test";
import TetoEgenResults from "@/pages/teto-egen-results";
import DrunkTest from "@/pages/drunk-test";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import NotFound from "@/pages/not-found";

import Footer from "@/components/Footer";
import Contact from "@/pages/contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/mbti" component={Test} />
      <Route path="/test" component={Test} />
      <Route path="/results" component={Results} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/type/:type" component={TypeDetail} />
      <Route path="/teto-egen-test" component={TetoEgenTest} />
      <Route path="/teto-egen-results" component={TetoEgenResults} />
      <Route path="/drunk-test" component={DrunkTest} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <Footer />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
