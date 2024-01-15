/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisanpresc.soap.sar.visprescsol;

import it.csi.apisan.apisanpresc.common.ApiSanPrescConstants;

import javax.xml.namespace.QName;
import javax.xml.ws.Service;
import javax.xml.ws.WebEndpoint;
import javax.xml.ws.WebServiceClient;
import javax.xml.ws.WebServiceFeature;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * This class was generated by Apache CXF 2.7.14
 * 2019-10-10T11:36:59.089+02:00
 * Generated source version: 2.7.14
 * 
 */
@WebServiceClient(name = "demVisualizzaPrescrittoPazienteSOL", 
                  wsdlLocation = ApiSanPrescConstants.SAR_VISUALIZZA_PRESCRITTO_PAZIENTE_SOL_WSDL,
                  targetNamespace = "http://visualizzaprescrittopazientesol.xsd.dem.regione.piemonte.it") 
public class DemVisualizzaPrescrittoPazienteSOL extends Service {

    public final static URL WSDL_LOCATION;

    public final static QName SERVICE = new QName("http://visualizzaprescrittopazientesol.xsd.dem.regione.piemonte.it", "demVisualizzaPrescrittoPazienteSOL");
    public final static QName DemVisualizzaPrescrittoPazienteSOL = new QName("http://visualizzaprescrittopazientesol.xsd.dem.regione.piemonte.it", "demVisualizzaPrescrittoPazienteSOL");
    static {
        URL url = null;
        try {
            url = new URL(ApiSanPrescConstants.SAR_VISUALIZZA_PRESCRITTO_PAZIENTE_SOL_ENDPOINT);
        } catch (MalformedURLException e) {
            java.util.logging.Logger.getLogger(DemVisualizzaPrescrittoPazienteSOL.class.getName())
                .log(java.util.logging.Level.INFO, 
                     "Can not initialize the default wsdl from {0}", "file:/C:/Work/CSIPiemonte/APISAN/apisanpresc/src/java/it/csi/apisan/apisanpresc/soap/sar/visprescsol/VisualizzaPrescrittoPazienteSOL1.wsdl");
        }
        WSDL_LOCATION = url;
    }

    public DemVisualizzaPrescrittoPazienteSOL(URL wsdlLocation) {
        super(wsdlLocation, SERVICE);
    }

    public DemVisualizzaPrescrittoPazienteSOL(URL wsdlLocation, QName serviceName) {
        super(wsdlLocation, serviceName);
    }

    public DemVisualizzaPrescrittoPazienteSOL() {
        super(WSDL_LOCATION, SERVICE);
    }
    
    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public DemVisualizzaPrescrittoPazienteSOL(WebServiceFeature ... features) {
        super(WSDL_LOCATION, SERVICE, features);
    }

    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public DemVisualizzaPrescrittoPazienteSOL(URL wsdlLocation, WebServiceFeature ... features) {
        super(wsdlLocation, SERVICE, features);
    }

    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public DemVisualizzaPrescrittoPazienteSOL(URL wsdlLocation, QName serviceName, WebServiceFeature ... features) {
        super(wsdlLocation, serviceName, features);
    }

    /**
     *
     * @return
     *     returns VisualizzaPrescrittoPazienteSOLPT
     */
    @WebEndpoint(name = "demVisualizzaPrescrittoPazienteSOL")
    public VisualizzaPrescrittoPazienteSOLPT getDemVisualizzaPrescrittoPazienteSOL() {
        return super.getPort(DemVisualizzaPrescrittoPazienteSOL, VisualizzaPrescrittoPazienteSOLPT.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns VisualizzaPrescrittoPazienteSOLPT
     */
    @WebEndpoint(name = "demVisualizzaPrescrittoPazienteSOL")
    public VisualizzaPrescrittoPazienteSOLPT getDemVisualizzaPrescrittoPazienteSOL(WebServiceFeature... features) {
        return super.getPort(DemVisualizzaPrescrittoPazienteSOL, VisualizzaPrescrittoPazienteSOLPT.class, features);
    }

}