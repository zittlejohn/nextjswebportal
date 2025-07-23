'use client';
import * as React from 'react';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { SignInPage } from '@toolpad/core/SignInPage';
import { providerMap } from '../../../auth';
import signIn from './actions';

function ForgotPasswordLink() {
  return (
    <span>
      <Link fontSize="0.75rem">
        Forgot password?
      </Link>
      <span> Contact 3pl@flsa.com.au</span>
    </span>
  );
}

function SignUpLink() {
  return (
    <span style={{ fontSize: '0.8rem' }}>
      Don&apos;t have an account?&nbsp;<Link href="/auth/signup">Sign up</Link>
    </span>
  );
}

function DemoInfo() {
  return (
    <Alert severity="info" sx={{ mb: 2, mt: 1 }}>
      Welcome to the new <strong>Cypher WMS Web Portal.</strong>Please <strong>Login</strong> continue or contact <strong>3pl@flsa.com.au</strong> to setup an account
    </Alert>
  );
}

export default function SignIn() {
  return (
    <SignInPage
      providers={providerMap}
      signIn={signIn}
      slots={{
        forgotPasswordLink: ForgotPasswordLink,
        // signUpLink: SignUpLink,
        subtitle: DemoInfo
      }}
    />
  );
}
