/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.screenserviziwebsol;

import javax.xml.ws.WebFault;


/**
 * This class was generated by Apache CXF 2.7.14
 * 2021-03-24T11:59:49.099+01:00
 * Generated source version: 2.7.14
 */

@WebFault(name = "Check_Eta_ScreeningFault", targetNamespace = "http://www.csi.it/ScreenServiziWebSOL/")
public class CheckEtaScreeningFaultException extends Exception {
    
    private it.csi.screenserviziwebsol.CheckEtaScreeningFault checkEtaScreeningFault;

    public CheckEtaScreeningFaultException() {
        super();
    }
    
    public CheckEtaScreeningFaultException(String message) {
        super(message);
    }
    
    public CheckEtaScreeningFaultException(String message, Throwable cause) {
        super(message, cause);
    }

    public CheckEtaScreeningFaultException(String message, it.csi.screenserviziwebsol.CheckEtaScreeningFault checkEtaScreeningFault) {
        super(message);
        this.checkEtaScreeningFault = checkEtaScreeningFault;
    }

    public CheckEtaScreeningFaultException(String message, it.csi.screenserviziwebsol.CheckEtaScreeningFault checkEtaScreeningFault, Throwable cause) {
        super(message, cause);
        this.checkEtaScreeningFault = checkEtaScreeningFault;
    }

    public it.csi.screenserviziwebsol.CheckEtaScreeningFault getFaultInfo() {
        return this.checkEtaScreeningFault;
    }
}