/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisanesen.dto.apisanesen;

import java.util.Objects;
import java.util.ArrayList;
import io.swagger.annotations.ApiModel;
import it.csi.apisan.apisanesen.dto.apisanesen.LuogoNascita;
import java.util.Date;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.annotate.JsonCreator;
import javax.validation.constraints.*;
import io.swagger.annotations.*;

@ApiModel(description="nel caso di richiesta esenzione per se stessi l'unico campo valorizzato è il codice fiscale, il resto dei dati vengono forniti solo in caso di richiesta per altri")

public class Cittadino   {
  // verra' utilizzata la seguente strategia serializzazione degli attributi: [explicit-as-modeled] 
  
  private String codiceFiscale = null;
  private String nome = null;
  private String cognome = null;
  private String sesso = null;
  private Date dataNascita = null;
  private LuogoNascita luogoNascita = null;

  /**
   * codice fiscale
   **/
  
  @ApiModelProperty(example = "AAAAAA00B77B000F", value = "codice fiscale")
  @JsonProperty("codice_fiscale") 
 
  public String getCodiceFiscale() {
    return codiceFiscale;
  }
  public void setCodiceFiscale(String codiceFiscale) {
    this.codiceFiscale = codiceFiscale;
  }

  /**
   * nome
   **/
  
  @ApiModelProperty(example = "Nome", value = "nome")
  @JsonProperty("nome") 
 
  public String getNome() {
    return nome;
  }
  public void setNome(String nome) {
    this.nome = nome;
  }

  /**
   * cognome
   **/
  
  @ApiModelProperty(example = "Cognome", value = "cognome")
  @JsonProperty("cognome") 
 
  public String getCognome() {
    return cognome;
  }
  public void setCognome(String cognome) {
    this.cognome = cognome;
  }

  /**
   * sesso
   **/
  
  @ApiModelProperty(example = "M", value = "sesso")
  @JsonProperty("sesso") 
 
  public String getSesso() {
    return sesso;
  }
  public void setSesso(String sesso) {
    this.sesso = sesso;
  }

  /**
   **/
  
  @ApiModelProperty(example = "1947-07-23", value = "")
  @JsonProperty("data_nascita") 
 
  public Date getDataNascita() {
    return dataNascita;
  }
  public void setDataNascita(Date dataNascita) {
    this.dataNascita = dataNascita;
  }

  /**
   **/
  
  @ApiModelProperty(value = "")
  @JsonProperty("luogo_nascita") 
 
  public LuogoNascita getLuogoNascita() {
    return luogoNascita;
  }
  public void setLuogoNascita(LuogoNascita luogoNascita) {
    this.luogoNascita = luogoNascita;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Cittadino cittadino = (Cittadino) o;
    return Objects.equals(codiceFiscale, cittadino.codiceFiscale) &&
        Objects.equals(nome, cittadino.nome) &&
        Objects.equals(cognome, cittadino.cognome) &&
        Objects.equals(sesso, cittadino.sesso) &&
        Objects.equals(dataNascita, cittadino.dataNascita) &&
        Objects.equals(luogoNascita, cittadino.luogoNascita);
  }

  @Override
  public int hashCode() {
    return Objects.hash(codiceFiscale, nome, cognome, sesso, dataNascita, luogoNascita);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Cittadino {\n");
    
    sb.append("    codiceFiscale: ").append(toIndentedString(codiceFiscale)).append("\n");
    sb.append("    nome: ").append(toIndentedString(nome)).append("\n");
    sb.append("    cognome: ").append(toIndentedString(cognome)).append("\n");
    sb.append("    sesso: ").append(toIndentedString(sesso)).append("\n");
    sb.append("    dataNascita: ").append(toIndentedString(dataNascita)).append("\n");
    sb.append("    luogoNascita: ").append(toIndentedString(luogoNascita)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

