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

(defn doAction [resp]
  (if (db/doAction) (resp/content-type (resp/response "success") "text/plain"))
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

(db/connect)