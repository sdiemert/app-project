(defproject app-project "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [compojure "1.5.1"]
                 [ring/ring-defaults "0.2.1"]
                 [environ "1.0.2"]
                 [grape/grape "0.1.0-SNAPSHOT-standalone"]
                 [ring-basic-authentication "1.0.5"]
                 [ring.middleware.logger "0.5.0"]
                 [log4j/log4j "1.2.17" :exclusions [javax.mail/mail
                                                    javax.jms/jms
                                                    com.sun.jmdk/jmxtools
                                                    com.sun.jmx/jmxri]]
                 [ring/ring-json "0.4.0"]
                 ]
  :plugins [[lein-ring "0.9.7"] [lein-environ "1.0.2"]]
  :ring {:handler app-project.core/app}
  :main app-project.core
  )
