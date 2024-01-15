/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.apisan.apisanvac.xml.centrivaccinali;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Classe Java per ArrayOfOrario complex type.
 * 
 * <p>Il seguente frammento di schema specifica il contenuto previsto contenuto in questa classe.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfOrario">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="Orario" type="{}Orario" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfOrario", propOrder = {
    "orario"
})
@Generated(value = "com.sun.tools.internal.xjc.Driver", date = "2019-12-03T10:16:04+01:00", comments = "JAXB RI v2.2.8-b130911.1802")
public class ArrayOfOrario {

    @XmlElement(name = "Orario", nillable = true)
    @Generated(value = "com.sun.tools.internal.xjc.Driver", date = "2019-12-03T10:16:04+01:00", comments = "JAXB RI v2.2.8-b130911.1802")
    protected List<Orario> orario;

    /**
     * Gets the value of the orario property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the orario property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getOrario().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Orario }
     * 
     * 
     */
    @Generated(value = "com.sun.tools.internal.xjc.Driver", date = "2019-12-03T10:16:04+01:00", comments = "JAXB RI v2.2.8-b130911.1802")
    public List<Orario> getOrario() {
        if (orario == null) {
            orario = new ArrayList<Orario>();
        }
        return this.orario;
    }

}
