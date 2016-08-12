(defproject app-project "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [compojure "1.5.1"]
                 [ring/ring-defaults "0.2.1"]
                 ]
  :plugins [[lein-ring "0.9.7"]]
  :ring {:handler app-project.core/app}
  :main app-project.core
  )
