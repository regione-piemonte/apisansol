/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.dma.farmab.interfacews.msg.getelencofarmacieabituali;

/**
 * Please modify this class to meet your needs
 * This class is not complete
 */

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import javax.xml.namespace.QName;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.ws.RequestWrapper;
import javax.xml.ws.ResponseWrapper;

/**
 * This class was generated by Apache CXF 2.7.14
 * 2021-11-18T11:25:37.799+01:00
 * Generated source version: 2.7.14
 * 
 */
public final class GetElencoFarmacieAbitualiService_GetElencoFarmacieAbitualiServiceImplPort_Client {

    private static final QName SERVICE_NAME = new QName("http://getelencofarmacieabituali.msg.interfacews.farmab.dma.csi.it/", "GetElencoFarmacieAbitualiServiceImplService");

    private GetElencoFarmacieAbitualiService_GetElencoFarmacieAbitualiServiceImplPort_Client() {
    }

    public static void main(String args[]) throws java.lang.Exception {
        URL wsdlURL = GetElencoFarmacieAbitualiServiceImplService.WSDL_LOCATION;
        if (args.length > 0 && args[0] != null && !"".equals(args[0])) { 
            File wsdlFile = new File(args[0]);
            try {
                if (wsdlFile.exists()) {
                    wsdlURL = wsdlFile.toURI().toURL();
                } else {
                    wsdlURL = new URL(args[0]);
                }
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }
      
        GetElencoFarmacieAbitualiServiceImplService ss = new GetElencoFarmacieAbitualiServiceImplService(wsdlURL, SERVICE_NAME);
        GetElencoFarmacieAbitualiService port = ss.getGetElencoFarmacieAbitualiServiceImplPort();  
        
        {
        System.out.println("Invoking getElencoFarmacieAbituali...");
        it.csi.dma.farmab.interfacews.msg.getelencofarmacieabituali.Richiedente _getElencoFarmacieAbituali_richiedente = null;
        java.lang.String _getElencoFarmacieAbituali_cfCittadino = "";
        javax.xml.ws.Holder<java.lang.String> _getElencoFarmacieAbituali_esito = new javax.xml.ws.Holder<java.lang.String>();
        javax.xml.ws.Holder<it.csi.dma.farmab.interfacews.msg.getelencofarmacieabituali.ElencoErroriType> _getElencoFarmacieAbituali_elencoErrori = new javax.xml.ws.Holder<it.csi.dma.farmab.interfacews.msg.getelencofarmacieabituali.ElencoErroriType>();
        javax.xml.ws.Holder<it.csi.dma.farmab.interfacews.msg.getelencofarmacieabituali.ElencoFarmacieType> _getElencoFarmacieAbituali_farmacieAbituali = new javax.xml.ws.Holder<it.csi.dma.farmab.interfacews.msg.getelencofarmacieabituali.ElencoFarmacieType>();
        port.getElencoFarmacieAbituali(_getElencoFarmacieAbituali_richiedente, _getElencoFarmacieAbituali_cfCittadino, _getElencoFarmacieAbituali_esito, _getElencoFarmacieAbituali_elencoErrori, _getElencoFarmacieAbituali_farmacieAbituali);

        System.out.println("getElencoFarmacieAbituali._getElencoFarmacieAbituali_esito=" + _getElencoFarmacieAbituali_esito.value);
        System.out.println("getElencoFarmacieAbituali._getElencoFarmacieAbituali_elencoErrori=" + _getElencoFarmacieAbituali_elencoErrori.value);
        System.out.println("getElencoFarmacieAbituali._getElencoFarmacieAbituali_farmacieAbituali=" + _getElencoFarmacieAbituali_farmacieAbituali.value);

        }

        System.exit(0);
    }

}