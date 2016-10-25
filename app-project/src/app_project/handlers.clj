(ns app-project.handlers
  (:require [ring.util.response :as resp]
            [app-project.db :as db]
            [clojure.data.json :as json]
            [app-project.util :as util]
            [clojure.string :as string]
            )
  )

(def timelines (json/read-str (slurp "resources/timelines.json")))

(defn serveIndex [resp]
  (resp/content-type (resp/resource-response "index.html" {:root "public"}) "text/html")
  )

(defn default [resp]
  (str "APP API Success Response")
  )

(defn get-key [req]
  (let [
        k (str (util/new-uuid))
        r (db/make-user k)
        ]
    (if (not r)
      (resp/status (resp/content-type (resp/response "not completed") "text/plain") 500)
      (resp/status (resp/content-type (resp/response k) "text/plain") 200)
      )
    )
  )

(defn get-username-from-req [req]
  "Fetches the username of the current user from the request"
  (get (get req :params) :uuid)
  )

(defn consent [req]
  (let [
        name (get-username-from-req req)
        agree (get (req :body) "consent")
        ts (quot (System/currentTimeMillis) 1000)
        ]
    (if (or (nil? name) (nil? agree))
      (resp/status (resp/content-type (resp/response "expected body with: { consent : XXXX}") "text/plain") 400)
      (if (db/consent name agree ts)
        (resp/status (resp/content-type (resp/response "success") "text/plain") 200)
        (resp/status (resp/content-type (resp/response "not completed") "text/plain") 500)
        )
      )
    )
  )

(defn exit-study [req]
  (let [
        name (get-username-from-req req)
        status (get (req :body) "exit-status")
        user-data (db/fetch-user name)
        ts (quot (System/currentTimeMillis) 1000)
        ]
    (if (or (nil? user-data) (nil? status))
      (resp/status (resp/content-type (resp/response "user not found or invalid status") "text/plain") 204)
      (if (db/exit-study name status ts)
        (resp/status (resp/content-type (resp/response "successfully exited study") "text/plain") 200)
        (resp/status (resp/content-type (resp/response "failed to exit study") "text/plain") 500)
        )
      )
    )
  )

(defn done-study [req]
  (let [
        name (get-username-from-req req)
        user-data (db/fetch-user name)
        ts (quot (System/currentTimeMillis) 1000)
        ]
    (if (nil? user-data)
      (resp/status (resp/content-type (resp/response "user not found or invalid status") "text/plain") 204)
      (if (db/done-study name ts)
        (resp/status (resp/content-type (resp/response "successfully completed study") "text/plain") 200)
        (resp/status (resp/content-type (resp/response "failed to exit study") "text/plain") 500)
        )
      )
    )
  )

(defn get-timeline [req]
  (let [
        qid (str ((req :params) :id))
        name (get-username-from-req req)
        ]
    (if (or (>= qid (count timelines)) (< qid 0))
      (resp/status (resp/content-type (resp/response "question number out of range.") "text/plain") 401)

      (if (db/has-already-answered name qid)
        (resp/status (resp/content-type (resp/response "this question has already been answered by this user") "text/plain") 412)
        (resp/status (resp/content-type (resp/response (timelines qid)) "application/json") 200)
        )

      )
    )
  )

(defn survey-response [req]
  (let
    [
     qid (str ((req :params) :qid))
     name (get-username-from-req req)
     ts (quot (System/currentTimeMillis) 1000)
     user-data (db/fetch-user name)
     answer (string/escape (get (req :body) "answer") {\' "" \; "" \" "" \% "" \& "" \\ ""})
     other (if (not (nil? (get (req :body) "additional"))) (string/escape (get (req :body) "additional") {\' "" \; "" \" "" \% "" \& "" \\ ""}) nil)
     ]

    (if (or (nil? qid) (nil? user-data) (nil? answer))
      (resp/status (resp/content-type (resp/response "invalid request") "text/plain") 400)
      (if (db/has-already-answered-survey name qid)
        (resp/status (resp/content-type (resp/response "already have a response for this question from this user") "text/plain") 412)
        (if (db/record-survey-response name qid ts answer other)
          (resp/status (resp/content-type (resp/response "success") "text/plain") 200)
          (resp/status (resp/content-type (resp/response "failed to log response") "text/plain") 500)
          )
        )
      )
    )
  )

(defn question-response [req]
  (let
    [
     qid (Integer/parseInt ((req :params) :qid))
     name (get-username-from-req req)
     lower-resp (get (req :body) "answer-lower")
     upper-resp (get (req :body) "answer-upper")
     ts (quot (System/currentTimeMillis) 1000)
     user-data (db/fetch-user name)
     next (if (>= qid (- (count timelines) 1)) nil (+ qid 1))
     ]

    (if (or (nil? qid) (nil? user-data) (nil? lower-resp) (nil? upper-resp))
      (resp/status (resp/content-type (resp/response "invalid request") "text/plain") 401)
      (if (db/has-already-answered name qid)
        (resp/status (resp/content-type (resp/response "already have a response for this question from this user") "text/plain") 412)
        (if (db/record-timeline-response name qid lower-resp upper-resp ts)
          (resp/status (resp/content-type (resp/response {:next next}) "application/json") 200)
          (resp/status (resp/content-type (resp/response "failed to log response") "text/plain") 500)
          )
        )
      )
    )
  )

(println (str "Using timeline data:" timelines " count " (count timelines)))

(db/connect)

