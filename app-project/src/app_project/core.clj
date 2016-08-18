(ns app-project.core
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults api-defaults]]
            [app-project.handlers :as handlers]
            [app-project.middleware :as middleware]
            [ring.middleware.basic-authentication :as auth]
            [ring.middleware.logger :as logger]
            [ring.middleware.json :refer [wrap-json-body wrap-json-response]]
            )
  )

(defroutes public-api-routes
           (POST "/auth" [] handlers/auth-user)
           )

(defroutes user-routes
           (GET "/" [] handlers/default)
           )

(defroutes admin-routes
           (POST    "/user"                   [] handlers/make-user)
           (DELETE  "/user/:user-id"          [] handlers/remove-user)
           (POST    "/user/:user-id/password" [] handlers/update-password)
           (GET     "/user"                   [] handlers/fetch-users)
           (GET     "/user/:user-id"          [] handlers/fetch-user)
           )


(defroutes public-routes

           ;; Route to serve a static index.html file
           (GET "/" [] handlers/serveIndex)

           ;; Default Routes
           (route/resources "/")
           (route/not-found "Not Found")
           )


(def app (-> (routes
               (context "/api" []
                        public-api-routes
                        (-> user-routes (wrap-routes auth/wrap-basic-authentication handlers/auth))
                        (context "/admin" []
                          (-> admin-routes (wrap-routes auth/wrap-basic-authentication handlers/admin-auth))
                          )
                 )
               public-routes ; routes accessible to the public.
               )
             (logger/wrap-with-logger)
             (wrap-json-body)
             (wrap-json-response)
             (wrap-defaults api-defaults)
             )
          )