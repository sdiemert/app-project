(ns app-project.middleware
  (:require [app-project.db :as db]
            [ring.util.response :as resp]
            )
  )

(defn admin-auth [req]
  (println "admin-auth middleware")
  (if (not (db/is-role ((req :params) :user) "admin"))
    (resp/status (resp/content-type (resp/response  "requires administrator privledges") "text/plain") 403)
    )
  )
