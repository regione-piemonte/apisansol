/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.apisan.apisanfse.integration.screening.dmacc;

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
 * 2021-01-18T13:29:41.923+01:00
 * Generated source version: 2.7.14
 * 
 */
public final class ScreeningService_ScreeningServicePort_Client {

    private static final QName SERVICE_NAME = new QName("http://dmacc.csi.it/", "ScreeningService");

    private ScreeningService_ScreeningServicePort_Client() {
    }

    public static void main(String args[]) throws java.lang.Exception {
        URL wsdlURL = ScreeningService_Service.WSDL_LOCATION;
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
      
        ScreeningService_Service ss = new ScreeningService_Service(wsdlURL, SERVICE_NAME);
        ScreeningService port = ss.getScreeningServicePort();  
        
        {
        System.out.println("Invoking getScreening...");
        it.csi.apisan.apisanfse.integration.screening.dmacc.ScreeningRequest _getScreening_getScreening = null;
        it.csi.apisan.apisanfse.integration.screening.dmacc.ScreeningResponse _getScreening__return = port.getScreening(_getScreening_getScreening);
        System.out.println("getScreening.result=" + _getScreening__return);


        }

        System.exit(0);
    }

}