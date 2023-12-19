/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {Storefront, HydrogenCart} from '@shopify/hydrogen';
import type {CustomerAccessToken} from '@shopify/hydrogen/storefront-api-types';
import type {HydrogenSession} from './server';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: 'production' | 'development'}};

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SESSION_SECRET: 'f9fc51fb41b58ed97d4632a00897415158e9370b';
    PUBLIC_STOREFRONT_API_TOKEN: '3e2ca061fb0d6494865a3a4d72435665';
    PRIVATE_STOREFRONT_API_TOKEN: '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';
    PUBLIC_STORE_DOMAIN: '2407b1.myshopify.com';
    PUBLIC_STOREFRONT_ID: '1000010423';
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: 'shp_055d2bcf-39ae-431f-8a49-3dcb0d508e6e';
    PUBLIC_CUSTOMER_ACCOUNT_API_URL: 'https://shopify.com/54883811427';
  }
}

declare module '@shopify/remix-oxygen' {
  /**
   * Declare local additions to the Remix loader context.
   */
  export interface AppLoadContext {
    env: Env;
    cart: HydrogenCart;
    storefront: Storefront;
    session: HydrogenSession;
    waitUntil: ExecutionContext['waitUntil'];
  }

  /**
   * Declare the data we expect to access via `context.session`.
   */
  export interface SessionData {
    customerAccessToken: CustomerAccessToken;
  }
}
