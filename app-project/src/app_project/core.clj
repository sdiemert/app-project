(ns app-project.core
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [app-project.handlers :as handlers]
            ))

(defroutes app-routes

           ;; REST API Routes
           (context "/api" []
                    (GET "/foobar" [] handlers/foobar)
                    (GET "/doAction" [] handlers/doAction)
                    )

           ;; Route to serve a static index.html file
           (GET "/" [] handlers/serveIndex)

           ;; Default Routes
           (route/resources "/")
           (route/not-found "Not Found")

 )

(def app
  (wrap-defaults app-routes site-defaults))

