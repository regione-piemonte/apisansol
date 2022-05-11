/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

DROP TABLE IF EXISTS `lms_utente_applicazioni`;

CREATE TABLE IF NOT EXISTS `lms_utente_applicazioni` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `applicazione_id` int(11) NOT NULL,
  `codice_fiscale` varchar(31) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soddisfazione_cliente_visualizzato` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica se il questionario � stato visualizzato',
  `data_creazione` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'La data di creazione del record assegnata dal sistema',
  `data_aggiornamento` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'La data dell''ultimo aggiornamento assegnata dal sistema',
  `data_cancellazione` datetime DEFAULT NULL COMMENT 'Soft delete',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_applicazione_utente` (`applicazione_id`,`codice_fiscale`) USING BTREE,
  CONSTRAINT `fk_applicazioni` FOREIGN KEY (`applicazione_id`) REFERENCES `lms_applicazioni` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE INDEX idx_codice_fiscale
ON lms_utente_applicazioni (codice_fiscale);