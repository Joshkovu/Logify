PYTHON ?= python

.PHONY: test test-backend

test: test-backend

test-backend:
	$(PYTHON) -m pytest
