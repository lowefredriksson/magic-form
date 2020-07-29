import React from 'react';

export type ErrorType = {
  message?: string;
  value: boolean;
};
//https://almerosteyn.com/2017/09/aria-live-regions-in-react
//https://medium.com/@gaurav5430/accessibility-quick-wins-error-messages-with-aria-live-7a622cb606f9
//https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA18
//https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19
//https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21
export const Error = ({ error, name }: { error: ErrorType | null, name: string}) => {
  return <div id={`${name}_error`} aria-live="assertive" role="alert" aria-atomic="true" >
    {error?.message}
  </div>
}

export const errorEquals = (oldError: ErrorType | null, newError: ErrorType | null) => {
  
  if (oldError === null && newError === null) {
    return true;
  }

  if (oldError === null && newError !== null) {
    return false;
  }

  if (oldError !== null && newError === null) {
    return false;
  }

  if (oldError!.value !== newError!.value) {
    return false;
  }

  if (oldError!.message !== newError!.message) {
    return false;
  }

};
