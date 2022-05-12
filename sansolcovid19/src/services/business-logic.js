/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { Cookies } from "quasar";

const COOKIE_OPTIONS = { path: "/" };

export const getUserMockParams = () => {
  let taxCode = Cookies.get("_shcf");
  let lastName = Cookies.get("_shc");
  let firstName = Cookies.get("_shn");
  return { taxCode, lastName, firstName };
};

export const setUserMockParams = ({ taxCode, lastName, firstName }) => {
  Cookies.set("_shcf", taxCode, COOKIE_OPTIONS);
  Cookies.set("_shc", lastName, COOKIE_OPTIONS);
  Cookies.set("_shn", firstName, COOKIE_OPTIONS);
};

export const clearUserMockParams = () => {
  Cookies.remove("_shcf", COOKIE_OPTIONS);
  Cookies.remove("_shc", COOKIE_OPTIONS);
  Cookies.remove("_shn", COOKIE_OPTIONS);
};


export const getApiMockParams = () => {
  return Cookies.get("x-bff-mocks");
};

export const setApiMockParams = value => {
  Cookies.set("x-bff-mocks", value, COOKIE_OPTIONS);
};

export const clearApiMockParams = () => {
  Cookies.remove("x-bff-mocks", COOKIE_OPTIONS);
};


export const  onPrintEvent = (eventNumber) => {
  const id=`evento-${eventNumber}`
  const prtHtml= document.getElementById(id).innerHTML;
  let stylesHtml = "";
  for (const node of [
    ...document.querySelectorAll('link[rel="stylesheet"], style')
  ]) {
    stylesHtml += node.outerHTML;
  }

  // Open the print window
  const WinPrint = window.open(
    "",
    "_blank"
  );
  WinPrint.document.write(`<!DOCTYPE html>
                  <html>
                    <head>
                      ${stylesHtml}
                    </head>
                    <title>provvedimento-contumaciale</title>
                    <body class="print-page" style="background-color: #FFFFFF">
                      ${prtHtml}
                    </body>
                  </html>`);

  setTimeout(()=>{
    WinPrint.focus();
    WinPrint.print();
  }, 100)


}
