/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.ptwsrv.business.webservice.ptwsrvavvisopagamento;

import java.net.MalformedURLException;
import java.net.URL;
import javax.xml.namespace.QName;
import javax.xml.ws.WebEndpoint;
import javax.xml.ws.WebServiceClient;
import javax.xml.ws.WebServiceFeature;
import javax.xml.ws.Service;

/**
 * This class was generated by Apache CXF 2.7.14
 * 2020-06-03T16:52:25.948+02:00
 * Generated source version: 2.7.14
 * 
 */
@WebServiceClient(name = "ptwsrvavvisopagamento", 
                  wsdlLocation = "file:/C:/Users/2048/AppData/Local/Temp/tempdir5219836473631776793.tmp/ptwsrvavvisopagamento_1.wsdl",
                  targetNamespace = "http://ptwsrvavvisopagamento.webservice.business.ptwsrv.csi.it/") 
public class Ptwsrvavvisopagamento extends Service {

    public final static URL WSDL_LOCATION;

    public final static QName SERVICE = new QName("http://ptwsrvavvisopagamento.webservice.business.ptwsrv.csi.it/", "ptwsrvavvisopagamento");
    public final static QName PtwsrvavvisopagamentoPort = new QName("http://ptwsrvavvisopagamento.webservice.business.ptwsrv.csi.it/", "ptwsrvavvisopagamentoPort");
    static {
        URL url = null;
        try {
            url = new URL("file:/C:/Users/2048/AppData/Local/Temp/tempdir5219836473631776793.tmp/ptwsrvavvisopagamento_1.wsdl");
        } catch (MalformedURLException e) {
            java.util.logging.Logger.getLogger(Ptwsrvavvisopagamento.class.getName())
                .log(java.util.logging.Level.INFO, 
                     "Can not initialize the default wsdl from {0}", "file:/C:/Users/2048/AppData/Local/Temp/tempdir5219836473631776793.tmp/ptwsrvavvisopagamento_1.wsdl");
        }
        WSDL_LOCATION = url;
    }

    public Ptwsrvavvisopagamento(URL wsdlLocation) {
        super(wsdlLocation, SERVICE);
    }

    public Ptwsrvavvisopagamento(URL wsdlLocation, QName serviceName) {
        super(wsdlLocation, serviceName);
    }

    public Ptwsrvavvisopagamento() {
        super(WSDL_LOCATION, SERVICE);
    }
    
    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public Ptwsrvavvisopagamento(WebServiceFeature ... features) {
        super(WSDL_LOCATION, SERVICE, features);
    }

    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public Ptwsrvavvisopagamento(URL wsdlLocation, WebServiceFeature ... features) {
        super(wsdlLocation, SERVICE, features);
    }

    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public Ptwsrvavvisopagamento(URL wsdlLocation, QName serviceName, WebServiceFeature ... features) {
        super(wsdlLocation, serviceName, features);
    }

    /**
     *
     * @return
     *     returns IPtwsrvServiceAvvisoPagamentoWS
     */
    @WebEndpoint(name = "ptwsrvavvisopagamentoPort")
    public IPtwsrvServiceAvvisoPagamentoWS getPtwsrvavvisopagamentoPort() {
        return super.getPort(PtwsrvavvisopagamentoPort, IPtwsrvServiceAvvisoPagamentoWS.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns IPtwsrvServiceAvvisoPagamentoWS
     */
    @WebEndpoint(name = "ptwsrvavvisopagamentoPort")
    public IPtwsrvServiceAvvisoPagamentoWS getPtwsrvavvisopagamentoPort(WebServiceFeature... features) {
        return super.getPort(PtwsrvavvisopagamentoPort, IPtwsrvServiceAvvisoPagamentoWS.class, features);
    }

}