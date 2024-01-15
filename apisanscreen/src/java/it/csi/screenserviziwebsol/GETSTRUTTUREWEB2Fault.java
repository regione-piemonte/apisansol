/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.screenserviziwebsol;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Classe Java per anonymous complex type.
 * 
 * <p>Il seguente frammento di schema specifica il contenuto previsto contenuto in questa classe.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="GET_STRUTTURE_WEB2Fault" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "getstruttureweb2Fault"
})
@XmlRootElement(name = "GET_STRUTTURE_WEB2Fault")
public class GETSTRUTTUREWEB2Fault {

    @XmlElement(name = "GET_STRUTTURE_WEB2Fault", required = true)
    protected String getstruttureweb2Fault;

    /**
     * Recupera il valore della proprietà getstruttureweb2Fault.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGETSTRUTTUREWEB2Fault() {
        return getstruttureweb2Fault;
    }

    /**
     * Imposta il valore della proprietà getstruttureweb2Fault.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGETSTRUTTUREWEB2Fault(String value) {
        this.getstruttureweb2Fault = value;
    }

}
