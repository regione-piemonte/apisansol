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
 *         &lt;element name="Scr_Mam_01Fault" type="{http://www.w3.org/2001/XMLSchema}string"/>
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
    "scrMam01Fault"
})
@XmlRootElement(name = "Scr_Mam_01Fault")
public class ScrMam01Fault {

    @XmlElement(name = "Scr_Mam_01Fault", required = true)
    protected String scrMam01Fault;

    /**
     * Recupera il valore della proprietà scrMam01Fault.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getScrMam01Fault() {
        return scrMam01Fault;
    }

    /**
     * Imposta il valore della proprietà scrMam01Fault.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setScrMam01Fault(String value) {
        this.scrMam01Fault = value;
    }

}
