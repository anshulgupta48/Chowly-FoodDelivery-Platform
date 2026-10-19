import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useSession } from './use-session';

/**
 * Keeps the visible route and the session in agreement.
 *
 * The redirect happens here, in the root layout, rather than inside a group
 * layout: swapping a layout's navigator for a <Redirect> leaves the router on a
 * route whose navigator no longer exists, which wedges the app on a blank screen.
 */
export const useProtectedRoute = () => {
  const { isResolving, isSignedIn, landingRoute } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isResolving) return;

    const group = segments[0];
    // The entry route decides for itself on first paint.
    if (group === undefined) return;

    const inAuthGroup = group === '(auth)';

    if (!isSignedIn && !inAuthGroup) {
      router.replace('/welcome');
      return;
    }

    if (isSignedIn && inAuthGroup) {
      router.replace(landingRoute);
    }
  }, [isResolving, isSignedIn, landingRoute, router, segments]);
};
