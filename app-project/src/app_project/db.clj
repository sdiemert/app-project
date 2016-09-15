 (ns app-project.db
   (:require [app-project.db-rules :as rules]
             [grape.core :as grape]
             [clojurewerkz.neocons.rest.cypher :as cy]
             ))

(defn connect [] (rules/initalizeGTS 'app))

(defn doAction []
  (grape/attempt rules/GTSystem (grape/apl 'doAction!))
  )

(defn auth [user pass]
  (grape/attempt rules/GTSystem (grape/apl 'authenticate? user pass))
  )

(defn is-role [user role]
  (grape/attempt rules/GTSystem (grape/apl 'is-role? user role))
  )

(defn make-user [user pass role]
  (if (not (grape/attempt rules/GTSystem (grape/apl 'user-exists? user)))
       (grape/attempt rules/GTSystem (grape/apl 'make-user! user pass role))
       false
    )
  )

(defn delete-user [user]
  (grape/attempt rules/GTSystem (grape/apl 'delete-user! user))
  )

(defn update-password [user newP oldP]
  (grape/attempt rules/GTSystem (grape/apl 'update-password! user oldP newP))
  )

(defn fetch-user [name]
  (let [
        q (str "MATCH (n {kind:'user', name:'" name "'}) RETURN n;")
        ;_ (println q)
        res (cy/tquery grape/conn q)
        ;_ (println res)
       ]
    (if (> (count res) 0)
      (get (get (first res) "n") :data)
      nil
      )
    )
  )

(defn fetch-users []
  (let [
        q (str "MATCH (n {kind:'user'}) RETURN n;")
        ;_ (println q)
        res (cy/tquery grape/conn q)
        ;_ (println res)
        ]
    (if (> (count res) 0)
      (map
        (fn [d] (get (get d "n") :data))
        res)
      nil
      )
    )
  )

(defn consent [user val ts]
  (grape/attempt rules/GTSystem (grape/apl 'update-consent! user (str val) (str ts)))
  )

(defn exit-study [user status ts]
  (grape/attempt rules/GTSystem (grape/apl 'exit-study! user (str status) (str ts)))
  )

(defn done-study [user ts]
  (grape/attempt rules/GTSystem (grape/apl 'done-study! user (str ts)))
  )


(defn record-timeline-response [user qid l-val u-val ts]
  (grape/attempt rules/GTSystem (grape/apl 'record-timeline-response! user (str qid) (str l-val) (str u-val) (str ts)))
  )

(defn has-already-answered [user qid]
  (grape/attempt rules/GTSystem (grape/apl 'already-answered? user (str qid)))
  )