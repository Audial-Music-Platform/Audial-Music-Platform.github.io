audial_audit <- function(event_ids) {
  values <- as.numeric(event_ids)
  values <- values[is.finite(values)]
  if (length(values) == 0L) return("No valid events")
  paste("Events:", length(values), "| Range:", min(values), "-", max(values))
}
