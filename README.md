# Raschietto

Progetto di un web scraper.
Corso di Tecnologie Web, prof. Vitali, anno 2016.


Un'applicazione per l'annotazione semantica di documenti realizzata con uso sofisticato di tecniche moderne di progettazione di applicazioni web desktop e mobile.
Ci sono due tipi di utente e quindi due modalità di uso dell'applicazione:
◆ Reader: La modalità di partenza, permette di scegliere il documento, scrollare, esaminare metadati e proprietà del documento e dei vari frammenti, cercare informazioni aggiuntive, e passare alla modalità seguente.
◆ Annotator: Un widget permette il passaggio dell'utente alla modalità annotazione, nella quale l'utente può creare nuove annotazioni indipendentemente da quelle già esistenti (eventualmente anche in sovrapposizione totale o parziale con altre annotazioni).

Le annotazioni sui documenti possono essere create automaticamente oppure manualmente.
Le annotazioni automatiche sono il risultato di un'attività di data scraping del testo e dei metadati dell'originale HTML.
Questa attività avviene appena viene visualizzato un documento che non è ancora presente nello storage delle annotazioni.
Successivamente l'annotator può esaminare la visualizzazione di queste annotazioni, correggerle oppure distruggerle, oppure crearne delle nuove.
