(ns app-project.core
  (:require [ring.adapter.jetty :as jetty :refer :all])
  )

(defn handler [request]

  (println "binbar")
  ;;(println request)

  {
   :status  200
   :headers {"Context-type" "text/html"}
   :body    "Hello World!"
   }
  )


(defn -main []
  (jetty/run-jetty handler {:port 4000})
  )

