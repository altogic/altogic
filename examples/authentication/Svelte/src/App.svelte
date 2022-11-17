<script>
  import { Router, Route, Link } from "svelte-navigator";
  import PrivateRoute from "./components/PrivateRoute.svelte";
  import IndexView from "./routes/index.svelte";
  import AuthRedirectView from "./routes/auth-redirect.svelte";
  import MagicLinkView from "./routes/magic-link.svelte";
  import SignInView from "./routes/sign-in.svelte";
  import SignUpView from "./routes/sign-up.svelte";
  import ProfileView from "./routes/profile.svelte";
</script>

<Router>
  <!-- Public Routes -->
  <Route path="/"><IndexView /></Route>
  <Route path="/auth-redirect"><AuthRedirectView /></Route>
  <Route path="/magic-link"><MagicLinkView /></Route>
  <Route path="/sign-in"><SignInView /></Route>
  <Route path="/sign-up"><SignUpView /></Route>
  <!-- Private Routes -->
  <Route path="/profile">
    <PrivateRoute>
      <ProfileView />
    </PrivateRoute>
  </Route>
</Router>
