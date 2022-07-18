/**
 * Util functions (or shared functionality which is needed
 * multiple timmes) to use within the hooks or as hooks
 */

import { resolveAny } from 'dns/promises';
import querystring from 'query-string';
import { useEffect, useRef } from 'react';

export const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export const getReferral = () => {
  // check url params, if current user came from referral (e.g newsletter)
  const urlParams = querystring.parse(window.location.search);
  // the pk_source param was generated in matomo
  return urlParams.pk_source;
};

export const getSocialMediaReferral = (): string | (string | null)[] | null => {
  // check url params, if current user came from referral (e.g newsletter)
  const urlParams = querystring.parse(window.location.search);
  // the pk_source param was generated in matomo
  return urlParams.referredByUser;
};

export const usePrevious = (value: any) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
