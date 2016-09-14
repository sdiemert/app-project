(ns app-project.handlers
  (:require [ring.util.response :as resp]
            [app-project.db :as db]
            [clojure.data.json :as json]
            )
  )

(def timelines (json/read-str (slurp "resources/timelines.json")))

(defn serveIndex [resp]
  (resp/content-type (resp/resource-response "index.html" {:root "public"}) "text/html")
  )

(defn default [resp]
  (str "APP API Success Response")
  )

(defn auth [name pass]
  "This must return nil so that subsequent routes can match."
  (let [
        result (db/auth name pass)
        ;_ (println (str "user-auth, result: " result))
        ]
    (if (not result) nil result)
    )
  )

(defn admin-auth [name pass]
  "This must return nil so that subsequent routes can match."
  (let [
        result (and (db/auth name pass) (db/is-role name "admin"))
        ;_ (println (str "admin-auth(" name "), result: " result))
        ]
    (if (not result) nil result)
    )
  )

(defn auth-user-http [req]
  "Authenticates a study user based on an http request (not an administrator)"
  (let [
        name (get (req :body) "username")
        pass (get (req :body) "password")
     ]
    (if (or (nil? name) (nil? pass))
      (resp/status (resp/content-type (resp/response "expected POST with JSON body like: {username:XXXX, password:XXXX}") "text/plain") 400)
      (if (and (db/auth name pass) (db/is-role name "user"))
        (resp/status (resp/content-type (resp/response "success") "text/plain") 200)
        (resp/status (resp/content-type (resp/response "failure") "text/plain") 401)
        )
      )
      )
  )

(defn make-user [req]
  (let [
        username (get (req :body) "username")
        pass (get (req :body) "password")
        role (case (get (req :body) "role")
               "admin" "admin"
               "user"
               )
        ]
    (if (db/make-user username pass role)
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

(defn fetch-users [req]
  (let [
        user-data (db/fetch-users)
        _ (println (str "user-data: " user-data) )
        ]

    (if (nil? user-data)
      (resp/status (resp/content-type (resp/response "not found") "text/plain") 200)
      (resp/status (resp/content-type (resp/response user-data) "application/json") 200)
      )
    )
  )

(defn fetch-user [req]
  (let [
        name ((req :params) :user-id)
        user-data (db/fetch-user name)
        ; _ (println (str "user-data: " user-data) )
     ]

    (if (nil? user-data)
      (resp/status (resp/content-type (resp/response "not found") "text/plain") 200)
      (resp/status (resp/content-type (resp/response user-data) "application/json") 200)
      )
  )
)

(defn consent [req]
  (let [
        name (get (req :body) "username")
        agree (get (req :body) "consent")
        ]
    (if (or (nil? name) (nil? agree))
      (resp/status (resp/content-type (resp/response "expected body with: { username : XXXX, consent : XXXX}") "text/plain") 400)

      (if (db/consent name agree)
        (resp/status (resp/content-type (resp/response "success") "text/plain") 200)
        (resp/status (resp/content-type (resp/response "not completed") "text/plain") 500)
        )
      )
    )
  )

(defn exit-study [req]
  (let [
        name (get (req :body) "username")
        status (get (req :body) "exit-status")
        user-data (db/fetch-user name)
        ]
    (if (or (nil? user-data) (nil? status))
      (resp/status (resp/content-type (resp/response "user not found or invalid status") "text/plain") 204)
      (if (db/exit-study name status)
        (resp/status (resp/content-type (resp/response "successfully exited study") "text/plain") 200)
        (resp/status (resp/content-type (resp/response "failed to exit study") "text/plain") 500)
        )
      )
    )
  )

(defn get-timeline [req]
  (let [
        qid (Integer/parseInt ((req :params) :id))
        ]
    (if (or (>= qid (count timelines)) (< qid 0))
      (resp/status (resp/content-type (resp/response "question number out of range.") "text/plain") 401)
      (resp/status (resp/content-type (resp/response (timelines qid)) "application/json") 200)
      )
    )
  )

(println (str "Using timeline data:" timelines " count " (count timelines)))

(db/connect)

