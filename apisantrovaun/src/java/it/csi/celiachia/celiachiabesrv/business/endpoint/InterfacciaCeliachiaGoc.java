/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.celiachia.celiachiabesrv.business.endpoint;

import java.net.MalformedURLException;
import java.net.URL;
import javax.xml.namespace.QName;
import javax.xml.ws.WebEndpoint;
import javax.xml.ws.WebServiceClient;
import javax.xml.ws.WebServiceFeature;
import javax.xml.ws.Service;

/**
 * This class was generated by Apache CXF 2.7.14
 * 2020-12-22T17:10:31.230+01:00
 * Generated source version: 2.7.14
 * 
 */
@WebServiceClient(name = "InterfacciaCeliachiaGoc", 
                  wsdlLocation = "http://localhost:8080/celiachiabesrv/services/InterfacciaCeliachiaGoc?wsdl",
                  targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it") 
public class InterfacciaCeliachiaGoc extends Service {

    public final static URL WSDL_LOCATION;

    public final static QName SERVICE = new QName("http://endpoint.business.celiachiabesrv.celiachia.csi.it", "InterfacciaCeliachiaGoc");
    public final static QName InterfacciaCeliachiaGocHttpSoap11Endpoint = new QName("http://endpoint.business.celiachiabesrv.celiachia.csi.it", "InterfacciaCeliachiaGocHttpSoap11Endpoint");
    public final static QName InterfacciaCeliachiaGocHttpsSoap11Endpoint = new QName("http://endpoint.business.celiachiabesrv.celiachia.csi.it", "InterfacciaCeliachiaGocHttpsSoap11Endpoint");
    public final static QName InterfacciaCeliachiaGocHttpsEndpoint = new QName("http://endpoint.business.celiachiabesrv.celiachia.csi.it", "InterfacciaCeliachiaGocHttpsEndpoint");
    public final static QName InterfacciaCeliachiaGocHttpsSoap12Endpoint = new QName("http://endpoint.business.celiachiabesrv.celiachia.csi.it", "InterfacciaCeliachiaGocHttpsSoap12Endpoint");
    public final static QName InterfacciaCeliachiaGocHttpSoap12Endpoint = new QName("http://endpoint.business.celiachiabesrv.celiachia.csi.it", "InterfacciaCeliachiaGocHttpSoap12Endpoint");
    public final static QName InterfacciaCeliachiaGocHttpEndpoint = new QName("http://endpoint.business.celiachiabesrv.celiachia.csi.it", "InterfacciaCeliachiaGocHttpEndpoint");
    static {
        URL url = null;
        try {
            url = new URL("http://localhost:8080/celiachiabesrv/services/InterfacciaCeliachiaGoc?wsdl");
        } catch (MalformedURLException e) {
            java.util.logging.Logger.getLogger(InterfacciaCeliachiaGoc.class.getName())
                .log(java.util.logging.Level.INFO, 
                     "Can not initialize the default wsdl from {0}", "http://localhost:8080/celiachiabesrv/services/InterfacciaCeliachiaGoc?wsdl");
        }
        WSDL_LOCATION = url;
    }

    public InterfacciaCeliachiaGoc(URL wsdlLocation) {
        super(wsdlLocation, SERVICE);
    }

    public InterfacciaCeliachiaGoc(URL wsdlLocation, QName serviceName) {
        super(wsdlLocation, serviceName);
    }

    public InterfacciaCeliachiaGoc() {
        super(WSDL_LOCATION, SERVICE);
    }
    
    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public InterfacciaCeliachiaGoc(WebServiceFeature ... features) {
        super(WSDL_LOCATION, SERVICE, features);
    }

    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public InterfacciaCeliachiaGoc(URL wsdlLocation, WebServiceFeature ... features) {
        super(wsdlLocation, SERVICE, features);
    }

    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public InterfacciaCeliachiaGoc(URL wsdlLocation, QName serviceName, WebServiceFeature ... features) {
        super(wsdlLocation, serviceName, features);
    }

    /**
     *
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpSoap11Endpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpSoap11Endpoint() {
        return super.getPort(InterfacciaCeliachiaGocHttpSoap11Endpoint, InterfacciaCeliachiaGocPortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpSoap11Endpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpSoap11Endpoint(WebServiceFeature... features) {
        return super.getPort(InterfacciaCeliachiaGocHttpSoap11Endpoint, InterfacciaCeliachiaGocPortType.class, features);
    }
    /**
     *
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpsSoap11Endpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpsSoap11Endpoint() {
        return super.getPort(InterfacciaCeliachiaGocHttpsSoap11Endpoint, InterfacciaCeliachiaGocPortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpsSoap11Endpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpsSoap11Endpoint(WebServiceFeature... features) {
        return super.getPort(InterfacciaCeliachiaGocHttpsSoap11Endpoint, InterfacciaCeliachiaGocPortType.class, features);
    }
    /**
     *
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpsEndpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpsEndpoint() {
        return super.getPort(InterfacciaCeliachiaGocHttpsEndpoint, InterfacciaCeliachiaGocPortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpsEndpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpsEndpoint(WebServiceFeature... features) {
        return super.getPort(InterfacciaCeliachiaGocHttpsEndpoint, InterfacciaCeliachiaGocPortType.class, features);
    }
    /**
     *
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpsSoap12Endpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpsSoap12Endpoint() {
        return super.getPort(InterfacciaCeliachiaGocHttpsSoap12Endpoint, InterfacciaCeliachiaGocPortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpsSoap12Endpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpsSoap12Endpoint(WebServiceFeature... features) {
        return super.getPort(InterfacciaCeliachiaGocHttpsSoap12Endpoint, InterfacciaCeliachiaGocPortType.class, features);
    }
    /**
     *
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpSoap12Endpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpSoap12Endpoint() {
        return super.getPort(InterfacciaCeliachiaGocHttpSoap12Endpoint, InterfacciaCeliachiaGocPortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpSoap12Endpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpSoap12Endpoint(WebServiceFeature... features) {
        return super.getPort(InterfacciaCeliachiaGocHttpSoap12Endpoint, InterfacciaCeliachiaGocPortType.class, features);
    }
    /**
     *
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpEndpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpEndpoint() {
        return super.getPort(InterfacciaCeliachiaGocHttpEndpoint, InterfacciaCeliachiaGocPortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns InterfacciaCeliachiaGocPortType
     */
    @WebEndpoint(name = "InterfacciaCeliachiaGocHttpEndpoint")
    public InterfacciaCeliachiaGocPortType getInterfacciaCeliachiaGocHttpEndpoint(WebServiceFeature... features) {
        return super.getPort(InterfacciaCeliachiaGocHttpEndpoint, InterfacciaCeliachiaGocPortType.class, features);
    }

}
