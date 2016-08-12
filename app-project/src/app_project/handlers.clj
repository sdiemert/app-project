(ns app-project.handlers
  (:require [ring.util.response :as resp]
            )
  )

(defn serveIndex [resp]
  (resp/content-type (resp/resource-response "index.html" {:root "public"}) "text/html")
  )

(defn foobar [resp]
  (str "foobar!")
  )