import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import SEO from "@/components/SEO";
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
import HoguTest from "@/pages/hogu-test";
import HoguResults from "@/pages/hogu-results";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";

import DopamineTest from "@/pages/dopamine-test";
import DopamineResults from "@/pages/dopamine-results";

import PetPersonalityPreferenceTest from "@/pages/petPersonalityPreference-test";
import PetPersonalityPreferenceResults from "@/pages/petPersonalityPreference-results";
import SocialMediaHabitsTest from "@/pages/socialMediaHabits-test";
import SocialMediaHabitsResults from "@/pages/socialMediaHabits-results";
import FriendshipCompatibilityTest from "@/pages/friendshipCompatibility-test";
import FriendshipCompatibilityResults from "@/pages/friendshipCompatibility-results";
import SocialMediaHabitsTestTest from "@/pages/socialMediaHabitsTest-test";
import SocialMediaHabitsTestResults from "@/pages/socialMediaHabitsTest-results";
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
      <Route path="/hogu-test" component={HoguTest} />
      <Route path="/hogu-results" component={HoguResults} />
      <Route path="/dopamine-test" component={DopamineTest} />
      <Route path="/dopamine-results" component={DopamineResults} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />

      <Route path="/petPersonalityPreference-test" component={PetPersonalityPreferenceTest} />
      <Route path="/petPersonalityPreference-results" component={PetPersonalityPreferenceResults} />
      <Route path="/socialMediaHabits-test" component={SocialMediaHabitsTest} />
      <Route path="/socialMediaHabits-results" component={SocialMediaHabitsResults} />
      <Route path="/friendshipCompatibility-test" component={FriendshipCompatibilityTest} />
      <Route path="/friendshipCompatibility-results" component={FriendshipCompatibilityResults} />
      <Route path="/socialMediaHabitsTest-test" component={SocialMediaHabitsTestTest} />
      <Route path="/socialMediaHabitsTest-results" component={SocialMediaHabitsTestResults} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SEO />
          <Toaster />
          <Router />
          <Footer />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
