(ns app-project.handlers
  (:require [ring.util.response :as resp]
            [app-project.db :as db]
            )
  )

(defn serveIndex [resp]
  (resp/content-type (resp/resource-response "index.html" {:root "public"}) "text/html")
  )

(defn foobar [resp]
  (str "foobar!")
  )

(defn doAction [resp]
  (if (db/doAction) (resp/content-type (resp/response "success") "text/plain"))
  )