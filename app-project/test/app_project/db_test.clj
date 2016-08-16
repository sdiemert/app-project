(ns app-project.db-test
  (:require [clojure.test :refer :all]
            [grape.core :as grape]
            [app-project.db-rules :as rules]
            [app-project.db :as db]
            )
  )

(defn one-time-setup []
  (rules/initalizeGTS 'dbtest)
  )

(defn one-time-teardown []
  ;; Defines a deletion rule and calls it repeatedly
  ;; to clean up after the test.
  (def gg (grape/rule 'deleteAnyNode! [] {:read (grape/pattern (grape/node 'n)) :delete ['n]} rules/GTSystem))
  (while (grape/attempt gg (grape/apl 'deleteAnyNode!)))
  )

(defn once-fixture [f]
  (one-time-setup)
  (f)
  (one-time-teardown)
  )

(use-fixtures :once once-fixture)

(deftest doTestAction
  (testing "Default Grape + App test"
    (is (db/doAction))
    )
 )
