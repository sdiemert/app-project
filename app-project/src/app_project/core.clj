(ns app-project.core
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults api-defaults]]
            [app-project.handlers :as handlers]
            [app-project.middleware :as middleware]
            [ring.middleware.basic-authentication :as auth]
            [ring.middleware.logger :as logger]
            [ring.middleware.session :as session]
            [ring.middleware.json :refer [wrap-json-body wrap-json-response]]
            )
  )

(defroutes user-routes
           (GET "/" [] handlers/default)
           (GET "/key" [] handlers/get-key)
           (POST "/consent" [] handlers/consent)
           (POST "/exit"     [] handlers/exit-study)
           (POST "/done"     [] handlers/done-study)
           (POST "/question/:qid" [] handlers/question-response)
           (GET  "/timeline/:id" [] handlers/get-timeline)
           )

(defroutes public-routes

           ;; Route to serve a static index.html file
           (GET "/" [] handlers/serveIndex)

           ;; Default Routes
           (route/resources "/")
           (route/not-found "Not Found")
           )

(def app (-> (routes
               (context "/api" [] user-routes)
               public-routes ; routes accessible to the public.
               )
             (logger/wrap-with-logger)
             (wrap-json-body)
             (wrap-json-response)
             (wrap-defaults api-defaults)
             )
          )