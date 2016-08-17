(ns app-project.handlers
  (:require [ring.util.response :as resp]
            [app-project.db :as db]
            )
  )

(defn serveIndex [resp]
  (resp/content-type (resp/resource-response "index.html" {:root "public"}) "text/html")
  )

(defn default [resp]
  (str "APP API Success Response")
  )

(defn auth [name pass] (db/auth name pass))

(defn make-user [req]
  (let [
        username (get (req :body) "username")
        pass (get (req :body) "password")
        ]
    (if (db/make-user username pass)
      (resp/status (resp/content-type (resp/response "success") "text/plain") 200)
      (resp/status (resp/content-type (resp/response "failure") "text/plain") 409)
      )
    )

  )

(defn remove-user [req]
  "Expects req to have atleast {:params {:user-id XXXX}}"
  (if (db/delete-user ((req :params) :user-id))
    (resp/status (resp/content-type (resp/response "success") "text/plain") 200)
    (resp/status (resp/content-type (resp/response "failure") "text/plain") 409)
    )
  )


(defn update-password [req]
  "Expects req to have atleast {:params {:user-id XXXX} :body {old-password XXXX, new-password XXXX}}"
  (println (req :body))
  (println (get (req :body) "new-password"))
  (println (get (req :body) "old-password"))

  (if (db/update-password
        ((req :params) :user-id)
        (get (req :body) "new-password")
        (get (req :body) "old-password")
        )
    (resp/status (resp/content-type (resp/response "success") "text/plain") 200)
    (resp/status (resp/content-type (resp/response "failure") "text/plain") 409)
    )
  )

(db/connect)