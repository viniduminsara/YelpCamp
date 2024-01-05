document.addEventListener('DOMContentLoaded', function () {
    const deleteButton = document.querySelector('.btn-danger');
    const checkboxes = document.querySelectorAll('.delete-checkbox input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const atLeastOneChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

            deleteButton.disabled = !atLeastOneChecked || allChecked;
        });
    });

    // Check initial state on page load
    const atLeastOneCheckedOnLoad = Array.from(checkboxes).some(checkbox => checkbox.checked);
    const allCheckedOnLoad = Array.from(checkboxes).every(checkbox => checkbox.checked);
    deleteButton.disabled = !atLeastOneCheckedOnLoad || allCheckedOnLoad;
});