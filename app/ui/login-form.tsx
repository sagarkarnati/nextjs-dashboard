'use client';
 
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GithubIcon, Chrome, AtSign, Key, AlertCircle, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSession, signIn, signOut } from 'next-auth/react';
 
export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
 
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Welcome back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Button variant="outline" className="w-full" type="button" onClick={() => signIn("github")}>
                <GithubIcon className="mr-2 h-5 w-5" />
                Continue with GitHub
              </Button>
              <Button variant="outline" className="w-full" type="button" onClick={() => signIn("google")}>
                <Chrome className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <form action={formAction} className="space-y-4" suppressHydrationWarning>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    className="pl-10"
                    suppressHydrationWarning
                  />
                  <AtSign className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pl-10"
                    suppressHydrationWarning
                  />
                  <Key className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>

              <Button className="w-full" disabled={isPending}>
                Sign in
                <ArrowRight className="ml-auto h-5 w-5" />
              </Button>

              {errorMessage && (
                <div className="flex items-center space-x-1 text-red-500">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}