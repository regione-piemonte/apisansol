/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.apisan.apisanfse.integration.esenzioni.dmacc;

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
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.xml.bind.annotation.XmlSeeAlso;

/**
 * This class was generated by Apache CXF 2.7.14
 * 2021-01-18T13:19:14.563+01:00
 * Generated source version: 2.7.14
 * 
 */
public final class EsenzioniService_EsenzioniServicePort_Client {

    private static final QName SERVICE_NAME = new QName("http://dmacc.csi.it/", "EsenzioniService");

    private EsenzioniService_EsenzioniServicePort_Client() {
    }

    public static void main(String args[]) throws java.lang.Exception {
        URL wsdlURL = EsenzioniService_Service.WSDL_LOCATION;
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
      
        EsenzioniService_Service ss = new EsenzioniService_Service(wsdlURL, SERVICE_NAME);
        EsenzioniService port = ss.getEsenzioniServicePort();  
        
        {
        System.out.println("Invoking getEsenzioni...");
        it.csi.apisan.apisanfse.integration.esenzioni.dmacc.EsenzioniRequest _getEsenzioni_getEsenzioni = null;
        it.csi.apisan.apisanfse.integration.esenzioni.dmacc.EsenzioniResponse _getEsenzioni__return = port.getEsenzioni(_getEsenzioni_getEsenzioni);
        System.out.println("getEsenzioni.result=" + _getEsenzioni__return);


        }

        System.exit(0);
    }

}
