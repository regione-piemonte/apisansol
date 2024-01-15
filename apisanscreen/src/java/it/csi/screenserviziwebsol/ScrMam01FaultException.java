/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.screenserviziwebsol;

import javax.xml.ws.WebFault;


/**
 * This class was generated by Apache CXF 2.7.14
 * 2021-03-24T11:59:49.035+01:00
 * Generated source version: 2.7.14
 */

@WebFault(name = "Scr_Mam_01Fault", targetNamespace = "http://www.csi.it/ScreenServiziWebSOL/")
public class ScrMam01FaultException extends Exception {
    
    private it.csi.screenserviziwebsol.ScrMam01Fault scrMam01Fault;

    public ScrMam01FaultException() {
        super();
    }
    
    public ScrMam01FaultException(String message) {
        super(message);
    }
    
    public ScrMam01FaultException(String message, Throwable cause) {
        super(message, cause);
    }

    public ScrMam01FaultException(String message, it.csi.screenserviziwebsol.ScrMam01Fault scrMam01Fault) {
        super(message);
        this.scrMam01Fault = scrMam01Fault;
    }

    public ScrMam01FaultException(String message, it.csi.screenserviziwebsol.ScrMam01Fault scrMam01Fault, Throwable cause) {
        super(message, cause);
        this.scrMam01Fault = scrMam01Fault;
    }

    public it.csi.screenserviziwebsol.ScrMam01Fault getFaultInfo() {
        return this.scrMam01Fault;
    }
}
